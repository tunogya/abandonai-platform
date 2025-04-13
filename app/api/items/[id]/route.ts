import {NextRequest} from "next/server";
import {verifyToken} from "@/app/_lib/jwt";
import {unauthorized} from "next/navigation";
import {docClient} from "@/app/_lib/dynamodb";
import {QueryCommand} from "@aws-sdk/lib-dynamodb";

const GET = async (req: NextRequest, {params}: {
  params: Promise<{id: string}>
}) => {
  let session;
  try {
    session = await verifyToken(req.headers.get("authorization")?.split(" ")?.[1]);
  } catch {
    unauthorized()
  }

  const {id} = await params;
  const {Items} = await docClient.send(new QueryCommand({
    TableName: "abandon",
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": session.user.sub,
      ":sk": `items#${id}#`,
    },
    ScanIndexForward: false,
    Limit: 20,
  }));
  return  Response.json(Items);
};

export {
  GET
}