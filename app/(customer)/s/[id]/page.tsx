import {docClient} from "@/app/_lib/dynamodb";
import {QueryCommand} from "@aws-sdk/lib-dynamodb";
import {notFound} from "next/navigation";
import {auth0} from "@/app/_lib/auth0";
import Image from "next/image";

const Page = async ({params}: {
  params: { id: string }
}) => {
  const session = await auth0.getSession();
  const id = (await params).id;
  const {Items} = await docClient.send(new QueryCommand({
    TableName: "abandon",
    IndexName: "GPK-GSK-index",
    // GPK = "series", GSK = id
    KeyConditionExpression: "GPK = :gpk AND GSK = :gsk",
    ExpressionAttributeValues: {
      ":gpk": "series",
      ":gsk": `prod_${id}`,
    },
  }));
  const series = Items?.[0];

  if (!series) {
    notFound();
  }

  // 准备开盒
  // 获取产品series的内容
  // 获取价格

  // 准备购买链接

  // 购买成功后通过回调获取产品


  return (
    <div className={"flex flex-col w-screen"}>
      <div className={"max-w-screen-sm mx-auto w-full"}>
        <div className={"flex flex-col items-center justify-center"}>
          <div className={"w-full overflow-scroll text-xs relative bg-blue-400"} style={{
            aspectRatio: "3/4"
          }}>
            <div className={"my-3"}>
              <div className={"text-center font-bold text-lg leading-5"}>
                {series.product.name}
              </div>
              <div className={"text-center break-words leading-5"}>
                {series.product?.description}
              </div>
            </div>
            <div className={"text-xs text-center my-1.5 break-words absolute bottom-0 w-full"}>
              <span className={"font-bold"}>{(series.price.unit_amount / 100).toFixed(2)}</span> tokens
            </div>
          </div>
        </div>
        <button
          className={"h-11 w-full text-white font-bold flex items-center justify-center mx-auto"}
          style={{
            background: "linear-gradient(90deg, #7638FA 0%, #D300C5 25%, #FF0069 50%, #FF7A00 75%, #FFD600 100%)"
          }}
        >
          Open the box
        </button>
        <div className={"p-3"}>
          {
            session?.user ? (
              <div className={"flex items-center pl-1.5 pr-4 py-1.5 border border-[#DBDBDB] rounded-full"}>
                {session.user.picture ? (
                  <Image src={session.user.picture} alt={""} width={36} height={36} className={"w-9 h-9 rounded-full mx-auto"}/>
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
                <button
                  className={"text-sm font-bold ml-3"}
                  // onClick={async () => {
                  //
                  // }}
                >
                  Top up
                </button>
              </div>
            ) : (
              <a href={`/auth/login?returnTo=/s/${params.id}&audience=https://abandon.ai/api`}>
                <div className={"flex items-center justify-center h-12 border border-[#DBDBDB] rounded-full"}>
                  <div className={"text-sm font-bold"}>
                    Log in and top up
                  </div>
                </div>
              </a>
            )
          }
        </div>

      </div>
    </div>
  )
}

export default Page;