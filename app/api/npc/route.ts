import {NextRequest} from "next/server";
import {verifyToken} from "@/app/_lib/jwt";
import {bedrockAgentClient} from "@/app/_lib/bedrockAgent";
import {CreateAgentCommand, CreateKnowledgeBaseCommand, CreateDataSourceCommand, AssociateAgentKnowledgeBaseCommand} from "@aws-sdk/client-bedrock-agent";
import {docClient} from "@/app/_lib/dynamodb";
import {PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";

// Get the list of NPCs under my name
const GET = async (req: NextRequest) => {
  let decodedToken;
  try {
    const accessToken = req.headers.get("authorization")?.split(" ")?.[1];
    if (!accessToken) {
      return Response.json({ok: false, msg: "Need Authorization"}, {status: 403});
    }
    decodedToken = await verifyToken(accessToken);
    if (!decodedToken) {
      return Response.json({ok: false, msg: "Invalid Authorization"}, {status: 403});
    }
  } catch (e) {
    return Response.json({ok: false, msg: e}, {status: 403});
  }
  const response = await docClient.send(new QueryCommand({
    TableName: "abandon",
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    FilterExpression: "#status <> :status",
    ExpressionAttributeValues: {
      ":pk": decodedToken.sub,
      ":sk": "NPC",
      ":status": "DELETED"
    },
    ExpressionAttributeNames: {
      "#id": "id",
      "#name": "name",
      "#status": "status",
    },
    ProjectionExpression: "#id, #name, description, createdAt",
  }));
  return Response.json({ok: true, items: response.Items}, {status: 200});
}

// Create a new NPC
const POST = async (req: NextRequest) => {
  let decodedToken;
  try {
    const accessToken = req.headers.get("authorization")?.split(" ")?.[1];
    if (!accessToken) {
      return Response.json({ok: false, msg: "Need Authorization"}, {status: 403});
    }
    decodedToken = await verifyToken(accessToken);
    if (!decodedToken) {
      return Response.json({ok: false, msg: "Invalid Authorization"}, {status: 403});
    }
  } catch (e) {
    return Response.json({ok: false, msg: e}, {status: 403});
  }
  const {name, instruction, description} = await req.json();

  if (!name || !instruction || !description) {
    return Response.json({ok: false, msg: "Missing required fields"}, {status: 400});
  }

  if (name.length > 100) {
    return Response.json({ok: false, msg: "Name too long"}, {status: 400});
  }

  if (instruction.length < 40 || instruction.length > 1000) {
    return Response.json({
      ok: false,
      msg: "Instruction must greater than or equal to 40 and less than 1000"
    }, {status: 400});
  }

  // check npc numbers
  try {
    const response = await docClient.send(new QueryCommand({
      TableName: "abandon",
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      FilterExpression: "#status <> :status",
      ExpressionAttributeValues: {
        ":pk": decodedToken.sub,
        ":sk": "NPC",
        ":status": "DELETED"
      },
      ExpressionAttributeNames: {
        "#id": "id",
        "#status": "status",
      },
      ProjectionExpression: "#id",
    }));
    if (response.Items?.length && response.Items?.length > 3) {
      return Response.json({ok: false, msg: "You have reached the maximum number of NPCs"}, {status: 400});
    }
  } catch (e) {
    console.log(e);
    return Response.json({ok: false, msg: e}, {status: 500});
  }

  try {
    const {agent} = await bedrockAgentClient.send(new CreateAgentCommand({
      agentName: name,
      instruction: instruction,
      description: description,
      foundationModel: "anthropic.claude-3-5-sonnet-20241022-v2:0",
      agentResourceRoleArn: process.env.AWS_AGENT_ARN || "",
      memoryConfiguration: {
        enabledMemoryTypes: ["SESSION_SUMMARY"],
        storageDays: 90,
        sessionSummaryConfiguration: {
          maxRecentSessions: 100,
        }
      },
    }));
    if (!agent?.agentId) {
      return Response.json({ok: false, msg: "Create agent failed"}, {status: 500});
    }
    await docClient.send(new PutCommand({
      TableName: "abandon",
      Item: {
        PK: decodedToken.sub,
        SK: `NPC-${agent.agentId}`,
        instruction: instruction,
        description: description,
        id: agent.agentId,
        name: agent.agentName,
        createdAt: agent.createdAt?.toISOString(),
        type: "NPC",
        sub: decodedToken.sub,
        GPK: "NPC",
        GSK: agent.agentId,
      }
    }));
    // create knowledge db

    // create knowledge base
    const {knowledgeBase} = await bedrockAgentClient.send(new CreateKnowledgeBaseCommand({
      name: agent.agentId,
      roleArn: process.env.AWS_KNOWLEDGE_BASE_ROLE_ARN || "",
      knowledgeBaseConfiguration: {
        type: "VECTOR",
        vectorKnowledgeBaseConfiguration: {
          embeddingModelArn: process.env.AWS_EMBEDDING_MODEL_ARN || "",
          supplementalDataStorageConfiguration: {
            storageLocations: [
              {
                s3Location: {
                  uri: `s3://transcribe.abandon.ai/${agent.agentId}`
                },
                type: "S3"
              }
            ]
          }
        }
      },
      storageConfiguration: {
        pineconeConfiguration: {
          connectionString: process.env.PINECONE_URI || "",
          credentialsSecretArn: process.env.AWS_SECRET_ARN_PINECONE_KEY || "",
          fieldMapping: {
            metadataField: "metadata",
            textField: "chunk"
          },
          namespace: agent.agentId
        },
        type: "PINECONE"
      },
    }));
    if (!knowledgeBase?.knowledgeBaseId) {
      return Response.json({ok: false, msg: "Create knowledge base failed"}, {status: 500});
    }
    // create dataSource
    const {dataSource} = await bedrockAgentClient.send(new CreateDataSourceCommand({
      knowledgeBaseId: knowledgeBase?.knowledgeBaseId,
      name: "s3",
      dataSourceConfiguration: {
        s3Configuration: {
          bucketArn: "arn:aws:s3:::datasets.abandon.ai",
          inclusionPrefixes: [
            agent.agentId
          ]
        },
        type: "S3"
      },
      dataDeletionPolicy: "DELETE",
      vectorIngestionConfiguration: {
        chunkingConfiguration: {
          chunkingStrategy: "HIERARCHICAL",
          hierarchicalChunkingConfiguration: {
            levelConfigurations: [
              {
                "maxTokens": 1500
              },
              {
                "maxTokens": 300
              }
            ],
            overlapTokens: 60
          }
        },
        parsingConfiguration: {
          bedrockDataAutomationConfiguration: {
            parsingModality: "MULTIMODAL"
          },
          parsingStrategy: "BEDROCK_DATA_AUTOMATION"
        }
      }
    }));

    await bedrockAgentClient.send(new AssociateAgentKnowledgeBaseCommand({
      agentId: agent.agentId,
      agentVersion: "DRAFT",
      knowledgeBaseId: knowledgeBase.knowledgeBaseId,
      description: "Add knowledge base",
      knowledgeBaseState: "ENABLED",
    }))
    if (!dataSource?.dataSourceId) {
      return Response.json({ok: false, msg: "Create data source failed"}, {status: 500});
    }
    return Response.json({ok: true, npc: agent, knowledgeBase, dataSource}, {status: 200});
  } catch (e) {
    console.log(e);
    return Response.json({ok: false, msg: e}, {status: 500});
  }
}

export {GET, POST}