import {NextRequest} from "next/server";
import stripe from "@/app/_lib/stripe";
import {verifyToken} from "@/app/_lib/jwt";
import {docClient} from "@/app/_lib/dynamodb";
import {GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";
import {unauthorized} from "next/navigation";

const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");

const GET = async (req: NextRequest) => {
  let session;
  try {
    const accessToken = req.headers.get("authorization")?.split(" ")?.[1];
    session = await verifyToken(accessToken);
  } catch (e) {
    console.log(e)
    unauthorized()
  }

  try {
    // get connect account from dynamodb
    const { Item } = await docClient.send(new GetCommand({
      TableName: "abandon",
      Key: {
        PK: session.sub,
        SK: isTestMode ? "CONNECT_ACCOUNT_TEST" : "CONNECT_ACCOUNT",
      },
      ProjectionExpression: "id",
    }));
    return Response.json({ok: true, account: Item?.id});
  } catch (e) {
    console.error('An error occurred when calling the DynamoDB API to get the connected account:', e);
    return Response.json({ok: false, msg: e}, {status: 500})
  }
}

const POST = async (req: NextRequest) => {
  let session;
  try {
    const accessToken = req.headers.get("authorization")?.split(" ")?.[1];
    session = await verifyToken(accessToken);
  } catch (e) {
    console.log(e)
    unauthorized()
  }

  try {
    const account = await stripe.accounts.create({
      controller: {
        stripe_dashboard: {
          type: "express",
        },
        fees: {
          payer: "application"
        },
        losses: {
          payments: "application"
        },
      },
    });

    // save connect id to dynamodb
    await docClient.send(new PutCommand({
      TableName: "abandon",
      Item: {
        PK: session.sub,
        SK: isTestMode ? "CONNECT_ACCOUNT_TEST" : "CONNECT_ACCOUNT",
        id: account.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        type: isTestMode ? "CONNECT_ACCOUNT_TEST" : "CONNECT_ACCOUNT",
      },
    }));

    return Response.json({ok: true, account: account.id})
  } catch (e) {
    console.error('An error occurred when calling the Stripe API to create an account:', e);
    return Response.json({ok: false, msg: e}, {status: 500})
  }
}

export {GET, POST}