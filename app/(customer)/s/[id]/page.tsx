import {docClient} from "@/app/_lib/dynamodb";
import {QueryCommand} from "@aws-sdk/lib-dynamodb";
import {notFound} from "next/navigation";

const Page = async ({params}: {
  params: { id: string }
}) => {
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
        <div className={"flex flex-col mt-3"}>
          <div className={"text-center font-bold text-lg leading-5"}>
            {series.product.name}
          </div>
          <div className={"text-center break-words leading-5"}>
            {series.product?.description}
          </div>
        </div>
        <div className={"flex items-center justify-center p-4"}>
          <div className={"w-full border rounded-lg overflow-scroll text-xs p-4"} style={{
            aspectRatio: "4/5",
          }}>
            {JSON.stringify(series, null, 2)}
          </div>
        </div>
        <div>
          <button
            className={"h-11 w-60 text-white font-bold rounded-full flex items-center justify-center mx-auto"}
            style={{
              background: "linear-gradient(90deg, #7638FA 0%, #D300C5 25%, #FF0069 50%, #FF7A00 75%, #FFD600 100%)"
            }}
          >
            Open the box
          </button>
        </div>
        <div className={"text-xs text-center my-1.5 break-words"}>
          You need to pay <span className={"font-bold"}>{(series.price.unit_amount / 100).toFixed(2)}</span> dollars.
        </div>
      </div>
    </div>
  )
}

export default Page;