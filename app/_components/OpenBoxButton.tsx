"use client";

import {FC} from "react";
import {openBox} from "@/app/_lib/actions";

const OpenBoxButton: FC<{
  disabled: boolean,
  amount: number,
  customer?: string,
  series: string,
  owner: string,
  sub?: string,
}> = (props) => {
  return (
    // TODO: when no loggin
    <button
      disabled={props.disabled}
      className={"h-11 w-full text-white font-bold flex items-center justify-center mx-auto"}
      style={{
        background: "linear-gradient(90deg, #7638FA 0%, #D300C5 25%, #FF0069 50%, #FF7A00 75%, #FFD600 100%)"
      }}
      onClick={async () => {
        if (!props.customer || !props.sub) {
          return;
        }
        await openBox(props.amount, props.customer, props.series, props.owner, props.sub);
      }}
    >
      <span className={"animate-pulse"}>
         Open the box
      </span>
    </button>
  )
}
export default OpenBoxButton;