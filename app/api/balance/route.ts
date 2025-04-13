import {NextRequest} from "next/server";
import {docClient} from "@/app/_lib/dynamodb";
import {GetCommand} from "@aws-sdk/lib-dynamodb";
import {verifyToken} from "@/app/_lib/jwt";
import {unauthorized} from "next/navigation";

const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");

const GET = async (req: NextRequest) => {
  let session;
  try {
    session = await verifyToken(req.headers.get("authorization")?.split(" ")?.[1]);
  } catch {
    unauthorized()
  }
  const {Item: customer} = await docClient.send(new GetCommand({
    TableName: "abandon",
    Key: {
      PK: session.sub,
      SK: isTestMode ? "customer.test" : "customer",
    },
    ProjectionExpression: "id",
  }));
  if (!customer) {
    return Response.json({
      balance: 0,
    })
  }
  const {Item} = await docClient.send(new GetCommand({
    TableName: "abandon",
    Key: {
      PK: customer.id,
      SK: "customer.balance",
    },
  }));
  return Response.json({
    balance: Item ? Item.balance * -1 / 100 : 0,
  });
}

export {GET}