import {NextRequest} from "next/server";
import stripe from "@/app/_lib/stripe";
import Stripe from "stripe";
import {docClient} from "@/app/_lib/dynamodb";
import {BatchWriteCommand, GetCommand} from "@aws-sdk/lib-dynamodb";

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
      // TODO: Needs to identify and handle livemode
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
        const _customer = await stripe.customers.update(customer as string, {
          // A negative number indicates that the "user has a balance."
          balance: amount_subtotal * -1,
        });
        await docClient.send(new BatchWriteCommand({
          RequestItems: {
            abandon: [
              {
                PutRequest: {
                  Item: {
                    PK: customer as string,
                    SK: id,
                    id: id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: customer as string,
                    SK: "customer.balance",
                    balance: _customer.balance,
                    object: "customer.balance",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    GPK: "customer.balance",
                    GSK: customer as string,
                  },
                },
              },
            ],
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