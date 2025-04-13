import {NextRequest} from "next/server";
import {verifyToken} from "@/app/_lib/jwt";
import {unauthorized} from "next/navigation";
import {docClient} from "@/app/_lib/dynamodb";
import {GetCommand} from "@aws-sdk/lib-dynamodb";

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
  const {Item} = await docClient.send(new GetCommand({
    TableName: "abandon",
    Key: {
      PK: session.sub,
      SK: id,
    },
  }));

  return  Response.json(Item);
};

export {
  GET
}