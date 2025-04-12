import {docClient} from "@/app/_lib/dynamodb";
import {GetCommand, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {notFound} from "next/navigation";
import {auth0} from "@/app/_lib/auth0";
import Image from "next/image";
import Link from "next/link";
import {getTranslations} from "next-intl/server";
import TopupButton from "@/app/_components/TopupButton";
import stripe from "@/app/_lib/stripe";
import OpenBoxButton from "@/app/_components/OpenBoxButton";

const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");

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
  let myItems = [];
  // Only the customer who has login, query by user.sub
  if (session) {
    const [customer_cache, my_boxes] = await Promise.all([
      docClient.send(new GetCommand({
        TableName: "abandon",
        Key: {
          PK: session.user.sub,
          SK: isTestMode ? "customer_test" : "customer",
        },
      })),
      docClient.send(new GetCommand({
        TableName: "abandon",
        Key: {
          PK: session.user.sub,
          SK: `box_ser#${id}`,
        }
      }))
    ]);
    if (customer_cache.Item?.id) {
      customer = customer_cache.Item.id;
    }
    if (my_boxes.Item && my_boxes.Item?.boxed) {
      myItems = my_boxes.Item.boxes
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
        SK: isTestMode ? "customer_test" : "customer",
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        object: "customer",
        GPK: "customer",
        GSK: session.user.sub,
      },
    }));
    customer = newId;
  }

  return (
    <div className={"flex flex-col w-screen"}>
      <div className={"max-w-screen-sm mx-auto w-full"}>
        <div className={"flex flex-col items-center justify-center"}>
          <div className={"font-bold text-lg leading-5 w-full px-3 py-3"}>
            {series.product.name}
          </div>
          <div className={"w-full overflow-scroll text-xs relative bg-blue-400"} style={{
            aspectRatio: "3/4"
          }}>
            <div className={"text-center absolute right-0 top-0 p-1.5"}>
              ({totalAvailable}/{totalSupply})
            </div>
            <div className={"text-xs text-center my-1.5 break-words absolute bottom-0 w-full"}>
              <span className={"font-bold"}>{(series.price.unit_amount / 100).toFixed(2)}</span> tokens
            </div>
          </div>
        </div>
        <OpenBoxButton
          disabled={totalAvailable === 0}
          amount={series.price.unit_amount}
          customer={customer}
          series={series.product.id}
        />
        <div className={"p-3"}>
          {
            session ? (
              <div className={"flex items-center pl-1.5 pr-4 py-1.5 border border-[#DBDBDB] rounded-full"}>
                {session.user.picture ? (
                  <Image src={session.user.picture} alt={""} width={36} height={36}
                         className={"w-9 h-9 rounded-full mx-auto"}/>
                ) : (
                  <div className={"w-9 h-9 rounded-full bg-black"}>
                  </div>
                )}
                <div className={"flex-1 ml-1.5 overflow-hidden"}>
                  <div className={"text-sm font-medium truncate leading-4"}>{session?.user.email}</div>
                  <div className={"text-xs font-medium leading-4 text-[#0095F6]"}>
                    0 tokens
                  </div>
                </div>
                {
                  customer && (
                    <TopupButton customer={customer} success_url={`${process.env.APP_BASE_URL}/s/${id}`}/>
                  )
                }
              </div>
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
        {
          session && (
            <div className={"px-3 py-3"}>
              <div className={"font-semibold leading-5"}>My items</div>
              <div className={"flex flex-col mt-1 gap-1.5"}>
                {
                  myItems && myItems?.map((item: {
                    id: string,
                    name: string,
                    description?: string,
                    image?: string,
                  }) => (
                    <div key={item.id} className={"h-11 w-full border border-[#DBDBDB] rounded-lg"}>
                    </div>
                  ))
                }
              </div>
            </div>
          )
        }
        <div className={"px-3 py-3"}>
          <div className={"font-semibold leading-5"}>Recently</div>
          <div className={"flex flex-col mt-1 gap-1.5"}>
            <div className={"h-11 w-full border border-[#DBDBDB] rounded-lg"}>

            </div>
            <div className={"h-11 w-full border border-[#DBDBDB] rounded-lg"}>

            </div>
            <div className={"h-11 w-full border border-[#DBDBDB] rounded-lg"}>

            </div>
            <div className={"h-11 w-full border border-[#DBDBDB] rounded-lg"}>

            </div>
          </div>
        </div>
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