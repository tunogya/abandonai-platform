const Page = () => {
  return (
    <div className={"mx-auto p-8 relative min-h-screen w-full"}>
      <div className={"text-3xl font-bold"}>Create a item</div>
      <div className={"flex gap-8 mt-8"}>
        <div className={"w-full max-w-[600px] max-h-[600px] border rounded-3xl"}>

        </div>
        <div className={"w-full flex flex-col gap-[32px]"}>
          <div>
            <div className={"font-bold"}>
              Collection
            </div>
            <div>
              Not all collections are eligible.
            </div>
          </div>
          <div>
            <div className={"font-bold"}>
              Name
            </div>
          </div>
          <div>
            <div className={"font-bold"}>
              Supply
            </div>
          </div>
          <div>
            <div className={"font-bold"}>
              Description
            </div>
          </div>
          <div>
            <div className={"font-bold"}>
              External link
            </div>
          </div>
          <div>
            <div className={"font-bold"}>
              Traits
            </div>
          </div>
        </div>
      </div>
      <div className={"border-t border-[#DBDBDB] absolute bottom-0 left-0 w-full px-8 py-3 flex flex-row-reverse"}>
        <button className={"hover:bg-foreground hover:text-background px-5 py-2.5 font-bold rounded-full border border-[#DBDBDB]"}>
          Create
        </button>
      </div>
    </div>
  )
}

export default Page;