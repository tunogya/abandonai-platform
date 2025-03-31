import {NextRequest} from "next/server";
import {verifyToken} from "@/lib/jwt";
import {bedrockAgentClient} from "@/lib/bedrockAgent";
import {CreateAgentCommand, CreateKnowledgeBaseCommand} from "@aws-sdk/client-bedrock-agent";
import {docClient} from "@/lib/dynamodb";
import {PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import { InvokeCommand } from "@aws-sdk/client-lambda";
import lambdaClient from "@/lib/lambda";

// 获取本人名下的 NPC 列表
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

// 创建一个新的 NPC
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
  const { name, instruction, description } = await req.json();

  if (!name || !instruction || !description) {
    return Response.json({ok: false, msg: "Missing required fields"}, {status: 400});
  }

  if (name.length > 100) {
    return Response.json({ok: false, msg: "Name too long"}, {status: 400});
  }

  if (instruction.length < 40 || instruction.length > 1000) {
    return Response.json({ok: false, msg: "Instruction must greater than or equal to 40 and less than 1000"}, {status: 400});
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

  const roleArn = `arn:aws:iam::913870644571:role/service-role/AmazonBedrockExecutionRoleForAgents_XW6XCMLTJ9`;
  try {
    const response = await bedrockAgentClient.send(new CreateAgentCommand({
      agentName: name,
      instruction: instruction,
      description: description,
      foundationModel: "anthropic.claude-3-5-sonnet-20241022-v2:0",
      agentResourceRoleArn: roleArn,
      memoryConfiguration: {
        enabledMemoryTypes: ["SESSION_SUMMARY"],
        storageDays: 90,
        sessionSummaryConfiguration: {
          maxRecentSessions: 100,
        }
      },
    }));
    await docClient.send(new PutCommand({
      TableName: "abandon",
      Item: {
        PK: decodedToken.sub,
        SK: `NPC-${response?.agent?.agentId}`,
        instruction: instruction,
        description: description,
        id: response?.agent?.agentId,
        name: response?.agent?.agentName,
        createdAt: response?.agent?.createdAt?.toISOString(),
        type: "NPC",
        sub: decodedToken.sub,
        GPK: "NPC",
        GSK: response?.agent?.agentId,
      }
    }));
    // create knowledge db
    await lambdaClient.send(new InvokeCommand({
      FunctionName: "arn:aws:lambda:us-west-2:913870644571:function:init-knowledge-base-schema",
      InvocationType: "Event",
      Payload: JSON.stringify({
        schema_name: response?.agent?.agentId,
      })
    }));
    // create knowledge base
    await bedrockAgentClient.send(new CreateKnowledgeBaseCommand({
      name: response?.agent?.agentId,
      roleArn: "arn:aws:iam::913870644571:role/service-role/AmazonBedrockExecutionRoleForKnowledgeBaseCluster",
      knowledgeBaseConfiguration: {
        type: "VECTOR",
        vectorKnowledgeBaseConfiguration: {
          embeddingModelArn: "arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1",
          embeddingModelConfiguration: {
            bedrockEmbeddingModelConfiguration: {
              dimensions: 1536,
              embeddingDataType: "FLOAT32",
            }
          },
          supplementalDataStorageConfiguration: {
            storageLocations: [
              {
                type: "S3",
                s3Location: {
                  uri: `s3://datasets.abandon.ai/${response?.agent?.agentId}`
                }
              }
            ]
          }
        }
      },
      storageConfiguration: {
        type: "RDS",
        rdsConfiguration: {
          resourceArn: "arn:aws:rds:us-west-2:913870644571:cluster:npc-knowledge",
          credentialsSecretArn: "arn:aws:secretsmanager:us-west-2:913870644571:secret:rds!cluster-201f8942-37a5-425a-93b4-33e0573f51d7-xsuo3t",
          databaseName: "bedrock_knowledge_base_cluster",
          tableName: `${response?.agent?.agentId}.bedrock_knowledge_base`,
          fieldMapping: {
            primaryKeyField: "id",
            vectorField: "embedding",
            textField: "chunks",
            metadataField: "metadata",
          }
        }
      }
    }))
    return Response.json({ok: true, npc: response.agent}, {status: 200});
  } catch (e) {
    console.log(e);
    return Response.json({ok: false, msg: e}, {status: 500});
  }
}

export {GET, POST}