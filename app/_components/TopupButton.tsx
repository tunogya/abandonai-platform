"use client";

import {FC, useState} from "react";
import {createTopupLink} from "@/app/_lib/actions";

const TopupButton: FC<{
  customer: string,
  success_url: string,
}> = ({customer, success_url}) => {
  const [status, setStatus] = useState("idle");

  return (
    <button
      disabled={status === "loading"}
      className={`text-sm font-bold ml-3 ${status === "loading" ? "animate-pulse" : ""}`}
      onClick={async () => {
        setStatus("loading");
        const {url} = await createTopupLink(customer, success_url);
        if (url) {
          window.open(url, "_blank");
        }
        setStatus("idle");
      }}
    >
      Top up
    </button>
  )
}

export default TopupButton;