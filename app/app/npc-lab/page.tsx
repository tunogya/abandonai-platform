import Link from "next/link";
import {ChevronDownIcon} from "@heroicons/react/16/solid";

const Page = () => {
  return (
    <div>
      <div className={"h-16 border-b flex items-center px-5 gap-5 border-gray-200"}>
        <div className={"text-[18px] font-bold"}>
          NPC
        </div>
        <div className={"flex items-center"}>
          <Link href={"/app/npc-lab"} className={"h-7 px-3 text-[14px] flex items-center font-medium bg-black rounded-full text-white"}>
            My NPC
          </Link>
          <Link href={"/app/npc-library"} className={"h-7 px-3 text-[14px] flex items-center font-medium text-gray-500 rounded-full"}>
            Library
          </Link>
          <Link href={"/app/npc-library/collections"} className={"h-7 px-3 text-[14px] flex items-center font-medium text-gray-500 rounded-full"}>
            Collections
          </Link>
        </div>
      </div>
      <div className={"flex flex-col gap-3 pt-5 pb-4"}>
        <div className={"flex gap-3 px-5 3xl:px-4 h-9"}>
          <input
            className={"flex h-9 w-full rounded-[10px] border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-none transition-colors placeholder:text-subtle focus-ring focus-visible:border-foreground focus-visible:ring-[0.5px] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 flex-1"}
            placeholder={"Search my NPC..."}
          />
          <button className={"border w-40 rounded-[10px] border-gray-200 text-sm font-medium text-start pl-3 pr-2 py-2 flex items-center"}>
            <div>
              Recent
            </div>
            <ChevronDownIcon className={"w-4 h-4 ml-auto text-gray-500"} />
          </button>
          <button className={"border w-40 rounded-[10px] border-gray-200 text-sm font-medium text-start pl-3 pr-2 py-2 flex items-center"}>
            <div>
              NPC type
            </div>
            <ChevronDownIcon className={"w-4 h-4 ml-auto text-gray-500"} />
          </button>
        </div>
        <div className={"w-full px-5 3xl:px-4"}>
          <div className={"flex h-9 p-1 px-1 gap-1"}>
            <button className={"flex items-center justify-center px-3 h-full text-sm font-medium rounded-full text-black bg-gray-100"}>All</button>
            <button className={"flex items-center justify-center px-3 h-full text-sm font-medium rounded-full text-gray-500"}>Personal</button>
            <button className={"flex items-center justify-center px-3 h-full text-sm font-medium rounded-full text-gray-500"}>Community</button>
            <button className={"flex items-center justify-center px-3 h-full text-sm font-medium rounded-full text-gray-500"}>Default</button>
          </div>
        </div>
        <div className={"md:flex flex items-center justify-between gap-6 px-5 pt-0 pb-5 mt-0 border-b"}>
          <div className="hstack items-center gap-3"><p
            className="text-sm text-subtle font-normal line-clamp-1 text-gray-500"><span
            className="text-sm font-medium mr-1 text-black">Create or clone a new NPC</span> (2 / 3 slots used)
          </p></div>
          <button
            className={"relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-200 focus-ring disabled:pointer-events-auto bg-foreground text-background shadow-none hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-400 disabled:text-gray-100 h-9 px-[12px] rounded-[10px] w-fit"}>
            Add a new NPC
          </button>
        </div>
      </div>

    </div>
  )
}

export default Page;