import Link from "next/link";

const Page = () => {
  return (
    <div>
      <div className={"h-16 border-b flex items-center px-5 gap-5"}>
        <div className={"text-[18px] font-bold"}>
          Innies
        </div>
        <div className={"flex items-center gap-2"}>
          <Link href={"/app/innie-lab"} className={"h-7 px-3 text-[14px] flex items-center font-medium"}>
            My innies
          </Link>
          <Link href={"/app/innie-library"} className={"h-7 px-3 text-[14px] flex items-center bg-black rounded-full text-white font-medium"}>
            Library
          </Link>
          <Link href={"/app/innie-library/collections"} className={"h-7 px-3 text-[14px] flex items-center font-medium"}>
            Collections
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Page;