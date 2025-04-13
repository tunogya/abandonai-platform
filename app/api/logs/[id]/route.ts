import {NextRequest} from "next/server";
import {docClient} from "@/app/_lib/dynamodb";
import {GetCommand} from "@aws-sdk/lib-dynamodb";

const GET = async (req: NextRequest, {params}: {
  params: Promise<{id: string}>
}) => {
  const {id} = await params;
  const {Item} = await docClient.send(new GetCommand({
    TableName: "abandon",
    Key: {
      PK: id,
      SK: "logs",
    },
  }));

  return  Response.json(Item);
};

export {
  GET
}