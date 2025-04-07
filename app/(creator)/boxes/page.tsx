import Link from "next/link";

const Page = () => {
  return (
    <div className={"md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] mx-auto"}>
      <div className={"py-4"}>
        <div className={"text-3xl font-bold py-4"}>Blind boxes</div>
      </div>
      <div className={"flex items-center justify-between border border-[#DBDBDB] p-8 rounded-2xl"}>
        <div className={""}>
          You haven’t created any blind boxes yet.
        </div>
        <Link href={"/create"} prefetch className={"hover:bg-foreground hover:text-background px-5 py-2.5 font-bold rounded-full border border-[#DBDBDB]"}>
          Create
        </Link>
      </div>
    </div>
  )
}

export default Page;