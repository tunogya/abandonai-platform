import {NextRequest} from "next/server";
import stripe from "@/lib/stripe";
import {verifyToken} from "@/lib/jwt";
import {docClient} from "@/lib/dynamodb";
import {GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";

const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");

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

  try {
    // get connect account from dynamodb
    const { Item } = await docClient.send(new GetCommand({
      TableName: "abandon",
      Key: {
        PK: decodedToken.sub,
        SK: isTestMode ? "CONNECT_ACCOUNT_TEST" : "CONNECT_ACCOUNT",
      },
      ProjectionExpression: "id",
    }))
    return Response.json({ok: true, account: Item?.id});
  } catch (e) {
    console.error('An error occurred when calling the DynamoDB API to get the connected account:', e);
    return Response.json({ok: false, msg: e}, {status: 500})
  }
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
        PK: decodedToken.sub,
        SK: isTestMode ? "CONNECT_ACCOUNT_TEST" : "CONNECT_ACCOUNT",
        id: account.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }));

    return Response.json({ok: true, account: account.id})
  } catch (e) {
    console.error('An error occurred when calling the Stripe API to create an account:', e);
    return Response.json({ok: false, msg: e}, {status: 500})
  }
}

export {GET, POST}