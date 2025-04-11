const Page = async ({params}: {
  params: { id: string }
}) => {
  const id = (await params).id;
  // 准备开盒
  // 获取产品series的内容
  // 获取价格

  // 准备购买链接

  // 购买成功后通过回调获取产品


  return (
    <div className={"flex flex-col w-screen"}>
      Series: {id}

      <div className={"my-6"}>
        <button
          className={"h-11 w-60 text-white font-bold rounded-full flex items-center justify-center mx-auto"}
          style={{
            background: "linear-gradient(90deg, #7638FA 0%, #D300C5 25%, #FF0069 50%, #FF7A00 75%, #FFD600 100%)"
          }}
        >
          Open
        </button>
      </div>
    </div>
  )
}

export default Page;