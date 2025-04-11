import Link from "next/link";
import {getTranslations} from "next-intl/server";
import {auth0} from "@/app/_lib/auth0";
import {docClient} from "@/app/_lib/dynamodb";
import {QueryCommand} from "@aws-sdk/lib-dynamodb";
import {unauthorized} from "next/navigation";
import Image from "next/image";
import SeriesShowItem from "@/app/_components/SeriesShowItem";

const Page = async () => {
  const t = await getTranslations("Series");
  const session = await auth0.getSession();
  if (!session) { unauthorized();}
  const {Items} = await docClient.send(new QueryCommand({
    TableName: "abandon",
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    // Filter, active: true or the active field does not exist
    FilterExpression: "attribute_not_exists(active) OR active = :active",
    ExpressionAttributeValues: {
      ":pk": session.user.sub,
      ":sk": "prod_",
      ":active": true,
    },
    Limit: 10,
    ScanIndexForward: false,
    // ExclusiveStartKey: "",
  }));

  return (
    <div className={"flex justify-center"}>
      <div className={"w-[482px] flex flex-col gap-8 my-9"}>
        {Items?.map((item: any) => {
          return (
            <SeriesShowItem key={item.product.id} item={item}/>
          )
        })}
        {
          Items?.length === 0 && (
            <div className={"flex flex-col border border-[#DBDBDB] p-8 rounded-lg gap-3 justify-center items-center w-[468px] mx-auto"}>
              <div>
                {t("You haven’t created any series yet")}
              </div>
              <Link href={"/series/create"} prefetch className={"w-60 h-11 font-bold rounded-xl bg-[#0095F6] text-white flex items-center justify-center"}>
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
          className={"text-[#0095F6] font-bold px-3 text-sm"}>
          Create new series
        </Link>
      </div>
    </div>
  )
}

export default Page;