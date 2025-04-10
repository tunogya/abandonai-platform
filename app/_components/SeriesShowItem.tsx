"use client";

import {FC} from "react";

const SeriesShowItem: FC<{
  item: {
    product: {
      name: string,
    },
    price: {
      unit_amount: number,
      currency: string,
    }
  }
}> = ({item}) => {
  return (
    <div className={"flex flex-col w-[468px] mx-auto"}>
      <div className={"flex justify-between items-center pb-3"}>
        <div className={"flex-1"}>
          <div className={"text-sm font-bold"}>{item.product.name}</div>
          <div className={"text-xs text-[#666666]"}>{item.price.unit_amount / 100} {item.price.currency}</div>
        </div>
        <button>
          <svg aria-label="More options" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24"
               role="img" viewBox="0 0 24 24" width="24"><title>More options</title>
            <circle cx="12" cy="12" r="1.5"></circle>
            <circle cx="6" cy="12" r="1.5"></circle>
            <circle cx="18" cy="12" r="1.5"></circle>
          </svg>
        </button>
      </div>
      <div className={"h-[585px] border border-[#DBDBDB] w-full rounded"}>

      </div>
    </div>
  )
}

export default SeriesShowItem;