import {NextRequest} from "next/server";
import stripe from "@/app/_lib/stripe";
import {verifyToken} from "@/app/_lib/jwt";
import {unauthorized} from "next/navigation";

const POST = async (req: NextRequest) => {
  try {
    const accessToken = req.headers.get("authorization")?.split(" ")?.[1];
    await verifyToken(accessToken);
  } catch (e) {
    console.log(e)
    unauthorized()
  }

  try {
    const { account } = await req.json();
    const accountLink = await stripe.accountLinks.create({
      account: account,
      refresh_url: `${req.headers.get("origin")}/accounts/refresh/${account}`,
      return_url: `${req.headers.get("origin")}/accounts`,
      type: "account_onboarding",
    });

    return Response.json({ url: accountLink.url });
  } catch (e) {
    console.error(
      "An error occurred when calling the Stripe API to create an account link:",
      e
    );
    return Response.json({ error: e }, {status: 500});
  }
}

export {POST}