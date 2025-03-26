import {NextRequest} from "next/server";
import {verifyToken} from "@/lib/jwt";
import {bedrockAgentClient} from "@/lib/bedrockAgent";
import {CreateAgentCommand} from "@aws-sdk/client-bedrock-agent";
import {docClient} from "@/lib/dynamodb";
import {PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";

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
    ExpressionAttributeValues: {
      ":pk": decodedToken.sub,
      ":sk": "NPC"
    }
  }));
  return Response.json({ok: true, items: response.Items}, {status: 200});
}

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

  const roleArn = `arn:aws:iam::913870644571:role/service-role/AmazonBedrockExecutionRoleForAgents_XW6XCMLTJ9`;
  try {
    const response = await bedrockAgentClient.send(new CreateAgentCommand({
      agentName: name,
      instruction: instruction,
      description: description,
      foundationModel: "anthropic.claude-3-5-sonnet-20241022-v2:0",
      agentResourceRoleArn: roleArn,
    }));
    await docClient.send(new PutCommand({
      TableName: "abandon",
      Item: {
        PK: decodedToken.sub,
        SK: `NPC-${response?.agent?.agentId}`,
        instruction: instruction,
        description: description,
        agentId: response?.agent?.agentId,
        agentName: response?.agent?.agentName,
        createdAt: response?.agent?.createdAt?.toISOString(),
        type: "NPC",
        GPK: "NPC",
        GSK: response?.agent?.agentId,
      }
    }));
    return Response.json({ok: true, npc: response.agent}, {status: 200});
  } catch (e) {
    console.log(e);
    return Response.json({ok: false, msg: e}, {status: 500});
  }
}

export {GET, POST}