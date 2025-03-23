import {NextRequest} from "next/server";
import stripe from "@/lib/stripe";
import {verifyToken} from "@/lib/jwt";

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
    return Response.json({ok: true, account: account.id})
  } catch (e) {
    console.error('An error occurred when calling the Stripe API to create an account:', e);
    return Response.json({ok: false, msg: e}, {status: 500})
  }
}

export {POST}