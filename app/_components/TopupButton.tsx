"use client";

import {FC, useEffect, useState} from "react";
import {createTopupLink} from "@/app/_lib/actions";
import {User} from "@auth0/nextjs-auth0/types";

const TopupButton: FC<{
  user: User,
  success_url: string,
}> = ({user, success_url}) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    (async() => {
      const {url} = await createTopupLink(user, success_url);
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