import {docClient} from "@/app/_lib/dynamodb";
import {QueryCommand} from "@aws-sdk/lib-dynamodb";

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
    return (
      <div className={"flex flex-col items-center justify-center h-screen"}>
        <svg width="141" height="61" viewBox="0 0 141 61" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M43.4221 41.3979L39.8443 41.4786L39.1125 58.8979L20.7353 60.5108L21.7111 41.8818L0 42.3657L6.0173 6.96245H21.3858L16.9135 31.6399L22.2803 31.4786L23.8253 0.914062H41.4706L40.2509 30.8334L43.4221 30.6721V41.3979Z" fill="url(#paint0_linear_23_3)"/>
          <path d="M96.3988 31.8818C96.3988 34.2474 96.1277 36.5995 95.5856 38.9383C95.0706 41.277 94.3117 43.5216 93.3088 45.6721C92.3059 47.8227 91.0727 49.8254 89.609 51.6802C88.1724 53.535 86.519 55.1479 84.6488 56.5189C82.7785 57.8899 80.7186 58.9651 78.4689 59.7447C76.2462 60.5243 73.8475 60.9141 71.2725 60.9141C68.6704 60.9141 66.2445 60.5243 63.9948 59.7447C61.7451 58.9651 59.6851 57.8899 57.8149 56.5189C55.9717 55.1479 54.3183 53.535 52.8547 51.6802C51.391 49.8254 50.1577 47.8227 49.1548 45.6721C48.152 43.5216 47.3795 41.277 46.8374 38.9383C46.3224 36.5727 46.0649 34.2205 46.0649 31.8818C46.0649 29.5431 46.3224 27.1909 46.8374 24.8254C47.3795 22.4598 48.152 20.2017 49.1548 18.0512C50.1577 15.9006 51.391 13.8979 52.8547 12.0431C54.3183 10.1614 55.9717 8.53503 57.8149 7.16406C59.6851 5.79309 61.7451 4.71783 63.9948 3.93826C66.2716 3.15869 68.6975 2.7689 71.2725 2.7689C73.8475 2.7689 76.2462 3.15869 78.4689 3.93826C80.7186 4.71783 82.7785 5.79309 84.6488 7.16406C86.519 8.53503 88.1724 10.1614 89.609 12.0431C91.0727 13.8979 92.3059 15.9006 93.3088 18.0512C94.3117 20.2017 95.0706 22.4598 95.5856 24.8254C96.1277 27.1909 96.3988 29.5431 96.3988 31.8818ZM79.2413 33.0915C79.2413 31.9087 79.0787 30.5915 78.7535 29.1399C78.4282 27.6883 77.9268 26.3307 77.2491 25.0673C76.5715 23.8038 75.7041 22.742 74.6471 21.8818C73.59 21.0216 72.3296 20.5915 70.8659 20.5915C69.3751 20.5915 68.1012 21.0216 67.0441 21.8818C65.987 22.742 65.1061 23.8038 64.4014 25.0673C63.7238 26.3307 63.2223 27.6883 62.8971 29.1399C62.5718 30.5915 62.4092 31.9087 62.4092 33.0915C62.4092 34.2743 62.5718 35.5915 62.8971 37.0431C63.2223 38.4947 63.7238 39.8522 64.4014 41.1157C65.1061 42.3791 65.987 43.4409 67.0441 44.3012C68.1012 45.1614 69.3751 45.5915 70.8659 45.5915C72.3296 45.5915 73.59 45.1614 74.6471 44.3012C75.7041 43.4409 76.5715 42.3791 77.2491 41.1157C77.9268 39.8522 78.4282 38.4947 78.7535 37.0431C79.0787 35.5915 79.2413 34.2743 79.2413 33.0915Z" fill="url(#paint1_linear_23_3)"/>
          <path d="M141 41.3979L137.422 41.4786L136.69 58.8979L118.313 60.5108L119.289 41.8818L97.5779 42.3657L103.595 6.96245H118.964L114.491 31.6399L119.858 31.4786L121.403 0.914062H139.048L137.829 30.8334L141 30.6721V41.3979Z" fill="url(#paint2_linear_23_3)"/>
          <defs>
            <linearGradient id="paint0_linear_23_3" x1="0" y1="30.9141" x2="141" y2="30.9141" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7638FA"/>
              <stop offset="0.25" stopColor="#D300C5"/>
              <stop offset="0.5" stopColor="#FF0069"/>
              <stop offset="0.75" stopColor="#FF7A00"/>
              <stop offset="1" stopColor="#FFD600"/>
            </linearGradient>
            <linearGradient id="paint1_linear_23_3" x1="0" y1="30.9141" x2="141" y2="30.9141" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7638FA"/>
              <stop offset="0.25" stopColor="#D300C5"/>
              <stop offset="0.5" stopColor="#FF0069"/>
              <stop offset="0.75" stopColor="#FF7A00"/>
              <stop offset="1" stopColor="#FFD600"/>
            </linearGradient>
            <linearGradient id="paint2_linear_23_3" x1="0" y1="30.9141" x2="141" y2="30.9141" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7638FA"/>
              <stop offset="0.25" stopColor="#D300C5"/>
              <stop offset="0.5" stopColor="#FF0069"/>
              <stop offset="0.75" stopColor="#FF7A00"/>
              <stop offset="1" stopColor="#FFD600"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    )
  }

  // 准备开盒
  // 获取产品series的内容
  // 获取价格

  // 准备购买链接

  // 购买成功后通过回调获取产品


  return (
    <div className={"flex flex-col w-screen"}>
      <div className={"max-w-screen-sm mx-auto w-full"}>
        <div className={"flex flex-col my-3"}>
          <div className={"text-center font-bold text-lg"}>
            {series.product.name}
          </div>
          <div className={"text-center break-words"}>
            {series.product?.description}
          </div>
        </div>
        <div className={"flex items-center justify-center my-4 p-4"}>
          <div className={"w-full border rounded-lg overflow-scroll"} style={{
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