import {NextRequest} from "next/server";
import stripe from "@/app/_lib/stripe";

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
  let event;
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

  event = await req.json();
  console.log(event);
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      break;
  }
  return Response.json({
    ok: true,
  })
}

export {POST}