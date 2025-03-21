import Link from "next/link";

const Page = () => {
  return (
    <div>
      <div className={"h-16 border-b flex items-center px-5 gap-5 border-gray-200 dark:border-gray-800"}>
        <div className={"text-[18px] font-bold"}>
          NPC
        </div>
        <div className={"flex items-center"}>
          <Link href={"/app/npc-lab"} className={"h-7 px-3 text-[14px] flex items-center font-medium text-gray-500 rounded-full"}>
            My NPC
          </Link>
          <Link href={"/app/npc-library"} className={"h-7 px-3 text-[14px] flex items-center rounded-full bg-foreground text-background font-medium"}>
            Library
          </Link>
          <Link href={"/app/npc-library/collections"} className={"h-7 px-3 text-[14px] flex items-center font-medium text-gray-500 rounded-full"}>
            Collections
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Page;