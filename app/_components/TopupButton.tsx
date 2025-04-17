"use client";

import {FC, useEffect, useState} from "react";
import {createTopupLink, getBalance} from "@/app/_lib/actions";
import Image from "next/image";
import {User} from "@auth0/nextjs-auth0/types";
import useSWR from "swr";

const TopupButton: FC<{
  user: User,
  balance: number,
  customer: string,
  success_url: string,
}> = ({user, customer, balance, success_url}) => {
  const [status, setStatus] = useState("idle");
  const [myBalance, setMyBalance] = useState(balance);
  const {data} = useSWR("/api/balance", async () => getBalance(user.sub), {
    refreshInterval: 5_000,
    dedupingInterval: 1_000,
  });

  useEffect(() => {
    if (data && data?.balance) {
      setMyBalance(data?.balance);
    }
  }, [data]);

  return (
    <div className={"flex items-center pl-1.5 pr-4 py-1.5 border border-[#DBDBDB] rounded-full"}>
      {user.picture ? (
        <Image src={user.picture} alt={""} width={36} height={36}
               className={"w-9 h-9 rounded-full mx-auto"}/>
      ) : (
        <div className={"w-9 h-9 rounded-full bg-black"}>
        </div>
      )}
      <div className={"flex-1 ml-1.5 overflow-hidden"}>
        <div className={"text-sm font-medium truncate leading-4"}>{user.email}</div>
        <div className={"text-xs font-medium leading-4 text-[#0095F6]"}>
          {myBalance} tokens
        </div>
      </div>
      {
        customer && (
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
    </div>
  )
}

export default TopupButton;