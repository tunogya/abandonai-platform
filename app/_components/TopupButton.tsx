"use client";

import {FC, useEffect, useState} from "react";
import {createTopupLink} from "@/app/_lib/actions";

const TopupButton: FC<{
  customer: string,
  success_url: string,
}> = ({customer, success_url}) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    (async() => {
      const {url} = await createTopupLink(customer, success_url);
      if (url) {
        setUrl(url);
      }
    })();
  }, []);

  return (
    <button
      disabled={!url}
      className={"text-sm font-bold ml-3"}
      onClick={() => {
        if (url) {
          window.open(url, "_blank");
        }
      }}
    >
      Top up
    </button>
  )
}

export default TopupButton;