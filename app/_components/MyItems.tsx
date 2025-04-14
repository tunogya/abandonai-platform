"use client";

import {FC, useEffect, useState} from "react";
import {User} from "@auth0/nextjs-auth0/types";
import useSWR from "swr";
import {getAccessToken} from "@auth0/nextjs-auth0";

const MyItems: FC<{
  user?: User,
  series: number,
}> = (props) => {
  const [myItems, setMyItems] = useState([]);
  const { data } = useSWR(`/api/items/${props.series}`, async (url) => fetch(url, {
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`
    }
  }).then(res => res.json()));

  useEffect(() => {
    if (data) {
      setMyItems(data);
    }
  }, [data]);

  return (
    <div className={"px-3 py-3"}>
      <div className={"font-semibold leading-5"}>My items</div>
      <div className={"flex flex-col mt-1 gap-1.5"}>
        {
          myItems && myItems?.map((item: {
            id: string,
            name: string,
            description?: string,
            image?: string,
          }) => (
            <div key={item.id} className={"h-11 w-full border border-[#DBDBDB] rounded-lg"}>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MyItems;