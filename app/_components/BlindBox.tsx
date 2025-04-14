"use client";

import {FC, useEffect, useState} from "react";
import useSWR from "swr";

const BlindBox: FC<{
  series: {
    product: {
      id: string,
      name: string,
      url: string,
    },
    price: {
      unit_amount: number,
      currency: string,
    },
    totalAvailable: number,
    totalSupply: number,
  }
}> = (props) => {
  const [series, setSeries] = useState(props.series);
  const {data} = useSWR(`/api/series/${series.product.id}`, (url) => fetch(url).then((res) => res.json()), {
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
        {series.product.name}
      </div>
      <div className={"w-full overflow-scroll text-xs relative bg-blue-400"} style={{
        aspectRatio: "3/4"
      }}>
        <div className={"text-center absolute right-0 top-0 p-1.5"}>
          ({series.totalAvailable}/{series.totalSupply})
        </div>
        <div className={"text-xs text-center my-1.5 break-words absolute bottom-0 w-full"}>
          <span className={"font-bold"}>{(series.price.unit_amount / 100).toFixed(2)}</span> tokens
        </div>
      </div>
    </div>
  )
}

export default BlindBox;