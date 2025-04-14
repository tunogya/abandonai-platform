"use client";

import {FC} from "react";
import useSWR from "swr";
import {getAccessToken} from "@auth0/nextjs-auth0";

const RecentLogs: FC<{
  series: string
}> = (props) => {
  const { data } = useSWR(`/api/logs/${props.series}`, async (url) => fetch(url, {
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`
    }
  }).then(res => res.json()));

  return (
    <div className={"px-3 py-3"}>
      <div className={"font-semibold leading-5"}>Recently</div>
      <div className={"flex flex-col mt-1 gap-1.5"}>
        {
          data && data?.map((item: {
            id: string,
            name: string,
            description: string,
            shared: boolean,
            createdAt: string
          }) => (
            <div key={item.id} className={"h-20 w-full border border-[#DBDBDB] rounded-lg flex items-center justify-center"}>
              {item.name}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default RecentLogs;