import Link from "next/link";

const Page = () => {
  return (
    <div className={"md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] mx-auto"}>
      <div className={"py-4"}>
        <div className={"text-3xl font-bold py-4"}>Series</div>
      </div>
      <div className={"flex items-center justify-between border border-[#DBDBDB] p-8 rounded-2xl"}>
        <div className={""}>
          You haven’t created any series yet.
        </div>
        <Link href={"/create"} prefetch className={"hover:bg-foreground hover:text-background px-8 h-12 font-bold rounded-full border border-[#DBDBDB] flex items-center justify-center"}>
          Create
        </Link>
      </div>
    </div>
  )
}

export default Page;