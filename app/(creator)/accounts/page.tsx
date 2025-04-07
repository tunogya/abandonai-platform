"use client";

import {useEffect, useState} from "react";
import {getAccessToken} from "@auth0/nextjs-auth0";
import useSWR from 'swr'

const Page = () => {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState();
  const [accessToken, setAccessToken] = useState(undefined);
  const {data, isLoading} = useSWR(accessToken ? "/api/connect/account" : null, (url) => fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json()));

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessToken();
      setAccessToken(accessToken);
    })();
  }, []);

  useEffect(() => {
    if (data && data?.account) {
      setConnectedAccountId(data.account);
    }
  }, [data]);

  return (
    <div className={"w-[893px] mx-auto"}>
      <div className={"py-9"}>
        <div className={"text-[21px] font-bold pb-2"}>
          专业账户管理界面
        </div>
        <div className={"flex gap-2 py-4 border-b border-[#DBDBDB]"}>
          <div className={"px-4 text-[15px] rounded-full h-11 font-semibold flex items-center bg-[#EFEFEF]"}>
            成效分析
          </div>
          {!isLoading && !connectedAccountId && (
            <button
              className={"px-4 text-[15px] rounded-full h-11 font-semibold flex items-center border border-[#DBDBDB]"}
              disabled={isLoading || accountCreatePending}
              onClick={async () => {
                setAccountCreatePending(true);
                fetch("/api/connect/account", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                })
                  .then((response) => response.json())
                  .then((json) => {
                    setAccountCreatePending(false);

                    const {account} = json;

                    if (account) {
                      setConnectedAccountId(account);
                    }
                  });
              }}
            >
              { accountCreatePending ? "Create an account..." : "Create an account" }
            </button>
          )}
          {!isLoading && connectedAccountId && (
            <button
              disabled={isLoading || accountLinkCreatePending}
              className={"px-4 text-[15px] rounded-full h-11 font-semibold flex items-center border border-[#DBDBDB]"}
              onClick={async () => {
                setAccountLinkCreatePending(true);
                fetch("/api/connect/account_link", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({
                    account: connectedAccountId,
                  }),
                })
                  .then((response) => response.json())
                  .then((json) => {
                    setAccountLinkCreatePending(false);

                    const {url} = json;
                    if (url) {
                      window.location.href = url;
                    }
                  });
              }}
            >
              { accountLinkCreatePending ? "Manage Account..." : "Manage Account"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;