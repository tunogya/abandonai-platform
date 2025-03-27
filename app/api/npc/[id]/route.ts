import {NextRequest} from "next/server";
import {verifyToken} from "@/lib/jwt";
import {bedrockAgentClient} from "@/lib/bedrockAgent";
import {DeleteAgentCommand} from "@aws-sdk/client-bedrock-agent";
import {docClient} from "@/lib/dynamodb";
import {QueryCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";

const GET = async (req: NextRequest, { params }: any) => {
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
  const { id: agentId } = await params;

  // get data by GPK and GSK
  // GPK = "NPC", GSK = agentId
  const {Items} = await docClient.send(new QueryCommand({
    TableName: "abandon",
    IndexName: "GPK-GSK-index",
    KeyConditionExpression: "GPK = :gpk AND GSK = :gsk",
    ExpressionAttributeValues: {
      ":gpk": "NPC",
      ":gsk": agentId
    },
    ProjectionExpression: "#id, #name, description, createdAt",
    ExpressionAttributeNames: {
      "#id": "id",
      "#name": "name",
    }
  }));

  if (!Items || Items.length === 0) {
    return Response.json({ok: false, msg: "NPC not found"}, {status: 404});
  }

  return Response.json({ok: true, item: Items[0]});
}

const DELETE = async (req: NextRequest, { params }: any) => {
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
  const { id: agentId } = await params;

  if (!agentId) {
    return Response.json({ok: false, msg: "Missing required fields"}, {status: 400});
  }

  try {
    await docClient.send(new UpdateCommand({
      TableName: "abandon",
      Key: {
        PK: decodedToken.sub,
        SK: `NPC-${agentId}`,
      },
      UpdateExpression: "SET #status = :status, #ttl = :ttl",
      ExpressionAttributeNames: {
        "#status": "status",
        "#ttl": "TTL",
      },
      ExpressionAttributeValues: {
        ":status": "DELETED",
        ":ttl": Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days later
      },
      ConditionExpression: "attribute_exists(SK)",
    }));
    // 删除前可能还有其他的操作
    await bedrockAgentClient.send(new DeleteAgentCommand({
      agentId: agentId,
    }));
    return Response.json({ok: true}, {status: 200});
  } catch (e: any) {
    if (e.name === "ConditionalCheckFailedException") {
      return Response.json({ok: false, msg: "NPC not found or no permission"}, {status: 404});
    }
    console.log(e);
    return Response.json({ok: false, msg: e}, {status: 500});
  }
}

export {GET, DELETE}