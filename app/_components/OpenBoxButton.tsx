"use client";

import {FC, useState} from "react";
import {openBox} from "@/app/_lib/actions";
import {User} from "@auth0/nextjs-auth0/types";

const OpenBoxButton: FC<{
  disabled: boolean,
  amount: number,
  customer?: string,
  series: string,
  owner: string,
  user?: User,
}> = (props) => {
  const [status, setStatus] = useState("idle");

  return (
    <button
      disabled={props.disabled}
      className={"h-11 w-full text-white font-bold flex items-center justify-center mx-auto"}
      style={{
        background: "linear-gradient(90deg, #7638FA 0%, #D300C5 25%, #FF0069 50%, #FF7A00 75%, #FFD600 100%)"
      }}
      onClick={async () => {
        if (!props.customer || !props.user?.sub) {
          return;
        }
        setStatus("loading");
        await openBox(props.amount, props.customer, props.series, props.owner, props.user);
        setStatus("idle");
      }}
    >
      <span className={status === "loading" ? "animate-pulse" : ""}>
         Open the box
      </span>
    </button>
  )
}
export default OpenBoxButton;