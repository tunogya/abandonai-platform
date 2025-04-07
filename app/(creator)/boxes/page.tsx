const Page = () => {
  return (
    <div className={"md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] mx-auto"}>
      <div className={"py-4"}>
        <div className={"text-3xl font-bold py-4"}>Blind boxes</div>
      </div>
      <div className={"flex items-center justify-between border border-[#DBDBDB] p-8"}>
        <div className={""}>
          You haven’t created any blind boxes yet.
        </div>
        <button className={"bg-black text-white px-4 py-2 font-semibold text-sm"}>
          Create
        </button>
      </div>
    </div>
  )
}

export default Page;