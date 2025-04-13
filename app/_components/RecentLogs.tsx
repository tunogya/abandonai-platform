"use client";

import {FC} from "react";

const RecentLogs: FC<{
  series: string
}> = (props) => {
  return (
    <div className={"px-3 py-3"}>
      <div className={"font-semibold leading-5"}>Recently</div>
      <div className={"flex flex-col mt-1 gap-1.5"}>
        <div className={"h-11 w-full border border-[#DBDBDB] rounded-lg"}>

        </div>
        <div className={"h-11 w-full border border-[#DBDBDB] rounded-lg"}>

        </div>
        <div className={"h-11 w-full border border-[#DBDBDB] rounded-lg"}>

        </div>
        <div className={"h-11 w-full border border-[#DBDBDB] rounded-lg"}>

        </div>
      </div>
    </div>
  )
}

export default RecentLogs;