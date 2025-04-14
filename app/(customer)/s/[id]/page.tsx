import {docClient} from "@/app/_lib/dynamodb";
import {GetCommand, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {notFound} from "next/navigation";
import {auth0} from "@/app/_lib/auth0";
import Link from "next/link";
import {getTranslations} from "next-intl/server";
import TopupButton from "@/app/_components/TopupButton";
import stripe from "@/app/_lib/stripe";
import OpenBoxButton from "@/app/_components/OpenBoxButton";
import BlindBox from "@/app/_components/BlindBox";
import RecentLogs from "@/app/_components/RecentLogs";
import MyItems from "@/app/_components/MyItems";

const Page = async ({params}: {
  params: Promise<{ id: string }>
}) => {
  const {id} = await params;
  const session = await auth0.getSession();
  const {Items} = await docClient.send(new QueryCommand({
    TableName: "abandon",
    IndexName: "GPK-GSK-index",
    // GPK = "series", GSK = id
    KeyConditionExpression: "GPK = :gpk AND GSK = :gsk",
    ExpressionAttributeValues: {
      ":gpk": "series",
      ":gsk": id,
    },
  }));
  const series = Items?.[0];
  if (!series) {
    notFound();
  }
  const t = await getTranslations('Root');
  // Iterate through the series?.boxes array, sum up each item.available, and get the totalAvailable.
  const totalAvailable = series?.boxes.reduce((acc: number, item: any) => {
    return acc + item.available;
  }, 0);
  // Iterate through the series?.boxes array, sum up each item.supply, and obtain the totalSupply.
  const totalSupply = series?.boxes.reduce((acc: number, item: any) => {
    return acc + item.supply;
  }, 0);
  // First, check if the customer information for the currently logged-in user exists.
  let customer: string | undefined = undefined;
  // Only the customer who has login, query by user.sub
  if (session) {
    const {Item} = await docClient.send(new GetCommand({
      TableName: "abandon",
      Key: {
        PK: session.user.sub,
        SK: "customer",
      },
      ProjectionExpression: "id",
    }));
    if (Item?.id) {
      customer = Item.id;
    }
  }
  // If user have logged in, but customer info does not exist, create a consumer.
  if (session && !customer) {
    // create a new customer, and record the information of sub
    const {id: newId} = await stripe.customers.create({
      email: session.user.email,
      name: session.user.name,
      metadata: {
        user: session.user.sub,
      }
    });
    // record in dynamodb
    await docClient.send(new PutCommand({
      TableName: "abandon",
      Item: {
        PK: session.user.sub,
        SK: "customer",
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        object: "customer",
        GPK: "customer",
        GSK: newId,
      },
    }));
    customer = newId;
  }
  let myBalance = 0;
  if (session && customer) {
    const {Item} = await docClient.send(new GetCommand({
      TableName: "abandon",
      Key: {
        PK: session.user.sub,
        SK: "customer",
      },
    }));
    if (Item) {
      myBalance = Item.balance * -1 / 100;
    }
  }

  return (
    <div className={"flex flex-col w-screen"}>
      <div className={"max-w-screen-sm mx-auto w-full"}>
        <BlindBox series={{
          product: series.product,
          price: series.price,
          totalAvailable: totalAvailable,
          totalSupply: totalSupply,
        }}/>
        <OpenBoxButton
          disabled={totalAvailable === 0}
          amount={series.price.unit_amount}
          customer={customer}
          series={series.product.id}
          owner={series.owner}
          user={session?.user}
        />
        <div className={"p-3"}>
          {
            (session && customer) ? (
              <TopupButton
                user={session.user}
                balance={myBalance}
                customer={customer}
                success_url={`${process.env.APP_BASE_URL}/s/${id}`}
              />
            ) : (
              <a href={`/auth/login?returnTo=/s/${id}&audience=https://abandon.ai/api`}>
                <div className={"flex items-center justify-center h-12 border border-[#DBDBDB] rounded-full"}>
                  <div className={"text-sm font-bold"}>
                    Log in and top up
                  </div>
                </div>
              </a>
            )
          }
        </div>
        <div className={"px-3 py-3"}>
          <div className={"font-semibold leading-5"}>Description</div>
          <div className={"text-sm mt-1"}>{series.product.description}</div>
        </div>
        <MyItems user={session?.user} series={series.product.id}/>
        <RecentLogs series={series.product.id}/>
        <div className={"p-3 flex justify-start items-center flex-col text-xs text-[#737373] mt-10"}>
          <div className={"flex gap-3 mt-4 w-screen md:overflow-scroll px-4 md:w-fit justify-center"}>
            <Link href={"/about.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
              {t("About")}
            </Link>
            <Link href={"https://x.com/abandonai"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
              X.com
            </Link>
            <Link href={"/privacy-policy.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
              {t("Privacy Policy")}
            </Link>
            <Link href={"/terms-of-use.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
              {t("Terms of Use")}
            </Link>
          </div>
          <div className={"py-0.5"}>
            {t("Copyright")} © {new Date().getFullYear()} Abandon Inc. {t("All rights reserved")}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page;