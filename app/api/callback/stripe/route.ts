import {NextRequest} from "next/server";
import stripe from "@/app/_lib/stripe";
import Stripe from "stripe";
import {docClient} from "@/app/_lib/dynamodb";
import {BatchWriteCommand, GetCommand, PutCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET_KEY || "";

const POST = async (req: NextRequest) => {
  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return Response.json({
      ok: false,
    }, {
      status: 403,
    })
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), sig, endpointSecret);
  } catch (e) {
    console.log(e)
    return Response.json({
      ok: false,
      error: e,
    }, {
      status: 400,
    })
  }
  switch (event.type) {
    case 'checkout.session.completed':
      const {id, customer, amount_subtotal} = event.data.object;
      if (customer && amount_subtotal) {
        // Need to check if the id has been processed, I mentioned storing the record.
        const {Item: checkout_session} = await docClient.send(new GetCommand({
          TableName: "abandon",
          Key: {
            PK: customer as string,
            SK: id, // session id
          },
          // Just return PK and SK.
          ProjectionExpression: "PK, SK",
        }));
        if (checkout_session) {
          break;
        }
        // Update the balance of the Stripe user customer
        await stripe.customers.createBalanceTransaction(customer as string, {
          amount: amount_subtotal * -1,
          currency: "usd",
          description: "Top-up",
        })
        await docClient.send(new PutCommand({
          TableName: "abandon",
          Item: {
            PK: customer as string,
            SK: id,
            id: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }));
        await docClient.send(new UpdateCommand({
          TableName: "abandon",
          Key: {
            PK: customer as string,
            SK: "customer.balance",
          },
          // 更新用户 balance，增加 amount_subtotal * -1
          UpdateExpression: "SET balance = if_not_exists(balance, :zero) + :delta, updatedAt = :updatedAt",
          ExpressionAttributeValues: {
            ":delta": amount_subtotal * -1,
            ":zero": 0,
            ":updatedAt": new Date().toISOString(),
          },
        }));
      }
      break;
  }
  return Response.json({
    ok: true,
  })
}

export {POST}