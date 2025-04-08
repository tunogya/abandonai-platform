import {auth0} from "@/app/_lib/auth0";
import {redirect, unauthorized} from "next/navigation";
import {docClient} from "@/app/_lib/dynamodb";
import {GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";
import stripe from "@/app/_lib/stripe";
import {getTranslations} from "next-intl/server";

const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");

const Page = async () => {
  const session = await auth0.getSession();
  if (!session) {unauthorized();}
  const { Item } = await docClient.send(new GetCommand({
    TableName: "abandon",
    Key: {
      PK: session.user.sub,
      SK: isTestMode ? "CONNECT_ACCOUNT_TEST" : "CONNECT_ACCOUNT",
    },
    ProjectionExpression: "id",
  }));
  const connectedAccountId = Item?.id;
  const t = await getTranslations('Dashboard');

  return (
    <div className={"md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] mx-auto"}>
      <div className={"py-9"}>
        <div className={"text-xl font-bold pb-2"}>
          {t("Professional dashboard")}
        </div>
        <div className={"flex gap-2 py-4 border-b border-[#DBDBDB]"}>
          <div className={"px-4 rounded-full h-11 font-semibold flex items-center bg-[#EFEFEF]"}>
            {t("Insights")}
          </div>
          {
            connectedAccountId ? (
              <form action={async () => {
                "use server";
                const accountLink = await stripe.accountLinks.create({
                  account: connectedAccountId,
                  refresh_url: `${process.env.APP_BASE_URL}/dashboard`,
                  return_url: `${process.env.APP_BASE_URL}/dashboard`,
                  type: "account_onboarding",
                });
                redirect(accountLink.url);
              }}>
                <button
                  className={"px-4 rounded-full h-11 font-semibold flex items-center border border-[#DBDBDB]"}
                  type={"submit"}
                >
                  {t("Manage account")}
                </button>
              </form>
            ) : (
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
                  {t("Create an account")}
                </button>
              </form>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default Page;