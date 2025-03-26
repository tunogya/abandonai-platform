import {NextRequest} from "next/server";
import {verifyToken} from "@/lib/jwt";
import {bedrockAgentClient} from "@/lib/bedrockAgent";
import {DeleteAgentCommand} from "@aws-sdk/client-bedrock-agent";
import {docClient} from "@/lib/dynamodb";
import {DeleteCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";

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
  //
  const {Items} = await docClient.send(new QueryCommand({
    TableName: "abandon",
    IndexName: "GPK-GSK-index",



  }))

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
    // 删除前可能还有其他的操作
    await bedrockAgentClient.send(new DeleteAgentCommand({
      agentId: agentId,
    }));
    await docClient.send(new DeleteCommand({
      TableName: "abandon",
      Key: {
        PK: decodedToken.sub,
        SK: `NPC-${agentId}`,
      }
    }));
    return Response.json({ok: true}, {status: 200});
  } catch (e) {
    console.log(e);
    return Response.json({ok: false, msg: e}, {status: 500});
  }
}

export {GET, DELETE}