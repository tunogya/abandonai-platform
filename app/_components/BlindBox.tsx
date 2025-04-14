"use client";

import {FC, useEffect, useState} from "react";
import useSWR from "swr";
import {SeriesPublic} from "@/app/_lib/types";

const BlindBox: FC<{ series: SeriesPublic }> = (props) => {
  const [series, setSeries] = useState(props.series);
  const {data} = useSWR(`/api/series/${props.series.id}`, (url) => fetch(url).then((res) => res.json()), {
    refreshInterval: 5_000,
    dedupingInterval: 1_000,
  });

  useEffect(() => {
    if (data) {
      setSeries(data);
    }
  }, [data]);

  return (
    <div className={"flex flex-col items-center justify-center"}>
      <div className={"font-bold text-lg leading-5 w-full px-3 py-3"}>
        {series.name}
      </div>
      <div className={"w-full overflow-scroll text-xs relative bg-blue-400 aspect-auto"}>
        {
          series?.image && (
            <img src={series.image} alt={""} className={"w-full h-full"}/>
          )
        }
        <div className={"text-center absolute right-0 top-0 p-1.5"}>
          ({series.totalAvailable}/{series.totalSupply})
        </div>
        <div className={"text-xs text-center my-1.5 break-words absolute bottom-0 w-full"}>
          <span className={"font-bold"}>{series.unit_amount / 100}</span> tokens
        </div>
      </div>
    </div>
  )
}

export default BlindBox;