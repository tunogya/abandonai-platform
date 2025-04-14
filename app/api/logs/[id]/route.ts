import {NextRequest} from "next/server";
import {docClient} from "@/app/_lib/dynamodb";
import {QueryCommand} from "@aws-sdk/lib-dynamodb";

const GET = async (req: NextRequest, {params}: {
  params: Promise<{id: string}>
}) => {
  const {id} = await params;
  const {Items} = await docClient.send(new QueryCommand({
    TableName: "abandon",
    IndexName: "GPK-GSK-index",
    KeyConditionExpression: "GPK = :gpk",
    ExpressionAttributeValues: {
      ":gpk": `items#${id}`,
    },
    ScanIndexForward: false,
    // filter share = true
    Limit: 20,
  }));
  // TODO, if shared = false, hidden something
  return  Response.json(Items);
};

export {
  GET
}