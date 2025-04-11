import SideBar from "@/app/_components/SideBar";
import {auth0} from "@/app/_lib/auth0";
import {redirect, unauthorized} from "next/navigation";
import {docClient} from "@/app/_lib/dynamodb";
import {GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";
import stripe from "@/app/_lib/stripe";
import {getTranslations} from "next-intl/server";

const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");

const Layout = async ({
                  children,
                }: Readonly<{
  children: React.ReactNode;
}>) => {
  const t = await getTranslations('Dashboard');
  const session = await auth0.getSession();
  if (!session) {
    unauthorized();
  }
  const { Item } = await docClient.send(new GetCommand({
    TableName: "abandon",
    Key: {
      PK: session.user.sub,
      SK: isTestMode ? "connect_account_test" : "connect_account",
    },
    ProjectionExpression: "id",
  }));
  const connectedAccountId = Item?.id;
  if (!connectedAccountId) {
    return (
      <div className={"flex flex-col items-center justify-center w-screen h-screen"}>
        <div className={"text-lg font-bold my-3"}>
         Onboard
        </div>
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
          const [, accountLink] = await Promise.all([
            docClient.send(new PutCommand({
              TableName: "abandon",
              Item: {
                PK: session.user.sub,
                SK: isTestMode ? "connect_account_test" : "connect_account",
                id: account.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                object: "connect_account",
                GPK: "connect_account",
                GSK: session.user.sub,
              },
            })),
            await stripe.accountLinks.create({
              account: account.id,
              refresh_url: `${process.env.APP_BASE_URL}/home`,
              return_url: `${process.env.APP_BASE_URL}/home`,
              type: "account_onboarding",
            })
          ]);
          redirect(accountLink.url);
        }}>
          <button
            className={"px-4 text-[15px] rounded-full h-11 font-semibold flex items-center border border-[#DBDBDB]"}
            type={"submit"}
          >
            {t("Create an account")}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className={"flex"}>
      <SideBar connectedAccountId={connectedAccountId}/>
      <main className={"ml-[245px] flex-1 overflow-y-auto bg-background"}>
        {children}
      </main>
    </div>
  )
}

export default Layout