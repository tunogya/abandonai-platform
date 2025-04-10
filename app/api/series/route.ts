import {NextRequest} from "next/server";
import {verifyToken} from "@/app/_lib/jwt";
import {unauthorized} from "next/navigation";
import {docClient} from "@/app/_lib/dynamodb";
import {QueryCommand} from "@aws-sdk/lib-dynamodb";

const GET = async (req: NextRequest) => {
  let session;
  try {
    session = await verifyToken(req.headers.get("authorization")?.split(" ")?.[1]);
  } catch {
    unauthorized()
  }
  const {Items, LastEvaluatedKey, Count, } = await docClient.send(new QueryCommand({
    TableName: "abandon",
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": session.sub,
      ":sk": "prod_",
    },
    Limit: 10,
    // ExclusiveStartKey: "",
  }));

  return Response.json({
    Items,
    LastEvaluatedKey,
    Count,
  });
}

export {GET}