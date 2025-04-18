import {NextRequest} from "next/server";
import stripe from "@/app/_lib/stripe";
import Stripe from "stripe";
import {docClient} from "@/app/_lib/dynamodb";
import {GetCommand, PutCommand, QueryCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";

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
        // Get user info from dynamodb
        const {Items} = await docClient.send(new QueryCommand({
          TableName: "abandon",
          IndexName: "GPK-GSK-index",
          KeyConditionExpression: "GPK = :GPK and GSK = :GSK",
          ExpressionAttributeValues: {
            ":GPK": "customer",
            ":GSK": customer,
          },
          ProjectionExpression: "PK, SK",
          Limit: 1,
        }));
        let sub;
        if (Items && Items.length > 0) {
          sub = Items[0].id;
        } else {
          return Response.json({
            ok: false,
            error: "User not found.",
          }, {
            status: 400,
          })
        }
        // Need to check if the id has been processed, I mentioned storing the record.
        const {Item: checkout_session} = await docClient.send(new GetCommand({
          TableName: "abandon",
          Key: {
            PK: sub,
            SK: id, // session id
          },
          // Just return PK and SK.
          ProjectionExpression: "PK, SK",
        }));
        if (checkout_session) {
          break;
        }
        // Update the balance of the Stripe user customer
        await Promise.all([
          // update customer balance at stripe
          stripe.customers.createBalanceTransaction(customer as string, {
            amount: amount_subtotal * -1,
            currency: "usd",
            description: "Top-up",
          }),
          // record this session for cache
          docClient.send(new PutCommand({
            TableName: "abandon",
            Item: {
              PK: sub,
              SK: id,
              id: id,
              object: "checkout.session",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
            },
          })),
          // update balance at dynamodb
          docClient.send(new UpdateCommand({
            TableName: "abandon",
            Key: {
              PK: sub,
              SK: "customer",
            },
            // Update user balance, increase by amount_subtotal * -1
            UpdateExpression: "SET balance = if_not_exists(balance, :zero) + :delta, updatedAt = :updatedAt",
            ExpressionAttributeValues: {
              ":delta": amount_subtotal * -1,
              ":zero": 0,
              ":updatedAt": new Date().toISOString(),
            },
          })),
        ])
      }
      break;
  }
  return Response.json({
    ok: true,
  })
}

export {POST}