import stripe from "@/app/_lib/stripe";
import {docClient} from "@/app/_lib/dynamodb";
import {PutCommand} from "@aws-sdk/lib-dynamodb";
import {auth0} from "@/app/_lib/auth0";
import {unauthorized} from "next/navigation";

const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");

const CreateConnectAccount = async () => {
  const session = await auth0.getSession();
  if (!session) {unauthorized();}

  return (
    <form action={async () => {
      "use server";
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
          PK: session.user.sub,
          SK: isTestMode ? "CONNECT_ACCOUNT_TEST" : "CONNECT_ACCOUNT",
          id: account.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          type: isTestMode ? "CONNECT_ACCOUNT_TEST" : "CONNECT_ACCOUNT",
        },
      }));
    }}>
      <button
        className={"px-4 text-[15px] rounded-full h-11 font-semibold flex items-center border border-[#DBDBDB]"}
        type={"submit"}
      >
        Create an account
      </button>
    </form>

  )
}

export default CreateConnectAccount;
