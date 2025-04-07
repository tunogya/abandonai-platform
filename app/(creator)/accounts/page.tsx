import {auth0} from "@/app/_lib/auth0";
import {unauthorized} from "next/navigation";
import {docClient} from "@/app/_lib/dynamodb";
import {GetCommand} from "@aws-sdk/lib-dynamodb";
import CreateConnectAccount from "@/app/_components/CreateConnectAccount";
import ManageConnectAccount from "@/app/_components/ManageConnectAccount";

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

  return (
    <div className={"w-[893px] mx-auto"}>
      <div className={"py-9"}>
        <div className={"text-[21px] font-bold pb-2"}>
          专业账户管理界面
        </div>
        <div className={"flex gap-2 py-4 border-b border-[#DBDBDB]"}>
          <div className={"px-4 text-[15px] rounded-full h-11 font-semibold flex items-center bg-[#EFEFEF]"}>
            成效分析
          </div>
          {
            connectedAccountId ? (
              <ManageConnectAccount connectedAccountId={connectedAccountId} />
            ) : (
              <CreateConnectAccount />
            )
          }
        </div>
      </div>
    </div>
  );
}

export default Page;