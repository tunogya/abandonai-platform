import Link from "next/link";
import {getTranslations} from "next-intl/server";
import {auth0} from "@/app/_lib/auth0";
import {docClient} from "@/app/_lib/dynamodb";
import {QueryCommand} from "@aws-sdk/lib-dynamodb";
import {unauthorized} from "next/navigation";
import Image from "next/image";

const Page = async () => {
  const t = await getTranslations("Series");
  const session = await auth0.getSession();
  if (!session) { unauthorized();}
  const {Items} = await docClient.send(new QueryCommand({
    TableName: "abandon",
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": session.user.sub,
      ":sk": "prod_",
    },
    Limit: 10,
    // ExclusiveStartKey: "",
  }));

  return (
    <div className={"flex justify-center"}>
      <div className={"w-[482px] flex flex-col gap-8 my-9"}>
        {Items?.map((item, index) => {
          return (
            <div key={index} className={"flex flex-col w-[468px] mx-auto"}>
              <div className={"flex justify-between items-center pb-3"}>
                <div className={"flex-1"}>
                  <div className={"text-sm font-bold"}>{item.product.name}</div>
                  <div className={"text-xs text-[#666666]"}>{item.price.unit_amount / 100} {item.price.currency}</div>
                </div>
                <button>
                  <svg aria-label="More options" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24"
                       role="img" viewBox="0 0 24 24" width="24"><title>More options</title>
                    <circle cx="12" cy="12" r="1.5"></circle>
                    <circle cx="6" cy="12" r="1.5"></circle>
                    <circle cx="18" cy="12" r="1.5"></circle>
                  </svg>
                </button>
              </div>
              <div className={"h-[585px] border border-[#DBDBDB] w-full rounded"}>

              </div>
            </div>
          )
        })}
        {
          Items?.length === 0 && (
            <div className={"flex items-center justify-between border border-[#DBDBDB] p-8 rounded-2xl"}>
              {t("You haven’t created any series yet")}
              <Link href={"/series/create"} prefetch className={"hover:bg-foreground hover:text-background px-8 h-12 font-bold rounded-full border border-[#DBDBDB] flex items-center justify-center"}>
                {t("Create")}
              </Link>
            </div>
          )
        }
      </div>
      <div className={"w-[384px] pl-16"}>
        <div className={"flex gap-3 items-center mb-6 my-9"}>
          <div className={"p-1.5"}>
            {
              session.user.picture ? (
                <Image src={session.user.picture} alt={""} width={44} height={44} className={"rounded-full"} />
              ) : (
                <div className={"w-11 h-11 bg-[#DBDBDB] rounded-full"} />
              )
            }
          </div>
          <div className={"flex flex-col flex-1"}>
            <div className={"text-sm font-semibold leading-4"}>
              {session.user.email}
            </div>
            <div className={"text-sm leading-4"}>
              {session.user.nickname}
            </div>
          </div>
          <a
            href={"/auth/logout"}
            className={"text-xs font-bold text-[#0095F6]"}>
            Log out
          </a>
        </div>
        <Link
          href={"/series/create"} prefetch
          className={"text-md font-bold text-[#0095F6]"}>
          Create new series
        </Link>
      </div>

    </div>
  )
}

export default Page;