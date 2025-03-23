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
    const { account } = await req.json();
    const accountLink = await stripe.accountLinks.create({
      account: account,
      refresh_url: `${req.headers.get("origin")}/app/payouts/refresh/${account}`,
      return_url: `${req.headers.get("origin")}/app/payouts/return/${account}`,
      type: "account_onboarding",
    });

    return Response.json({ ok: true, url: accountLink.url });
  } catch (e) {
    console.error(
      "An error occurred when calling the Stripe API to create an account link:",
      e
    );
    return Response.json({ ok: false, msg: e }, {status: 500});
  }
}

export {POST}