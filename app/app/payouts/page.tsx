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
      console.log(accessToken);
      setAccessToken(accessToken);
    })();
  }, []);

  useEffect(() => {
    if (data && data?.account) {
      setConnectedAccountId(data.account);
    }
  }, [data]);

  return (
    <div>
      <header className="hidden lg:block sticky top-[28px] lg:-top-[40px] border-b z-[9]">
        <div className="bg-background/80 backdrop-blur-md">
          <div className="w-full max-w-[105rem] mx-auto stack gap-1">
            <div className="hstack justify-between items-center w-full px-6 2.5xl:px-4">
              <div className="stack gap-0.5 py-6 pr-6 max-w-[64rem]">
                <div className="text-xl text-foreground font-semibold origin-left line-clamp-1">Payouts</div>
                <div className="text-sm text-gray-500 font-normal line-clamp-1 min-h-[1em]">
                  Earn cash rewards for sharing your NPC in the NPC Library
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="w-full max-w-[105rem] mx-auto p-4 lg:p-6 2.5xl:px-4">
        <div className="relative flex-1 min-h-0">
          <div className="max-w-3xl mx-auto">
            <div
              className={`${connectedAccountId ? "" : "bg-yellow-50"} border border-gray-200 shadow-sm p-3 mt-3 rounded-lg flex flex-row items-center justify-between gap-3`}>
              <div>
                <p className="block font-bold text-foreground">
                  {
                    connectedAccountId ? "Manage Stripe Connect Account" : "Create Stripe Connect Account"
                  }
                </p><span
                className="block text-sm font-normal text-gray-700">
                <p>
                  {
                    connectedAccountId ? "Your Stripe Connect account is connected to your Abandon account. Manage your account and payouts." : "We use Stripe Connect to process payments. Connect your Stripe Connect account to receive payments for rewards you&#39;ve earned."
                  }
                </p></span>
              </div>
              {!connectedAccountId && (
                <button
                  className="flex items-center bg-foreground text-background text-[14px] px-2 py-3 font-medium rounded-[10px] leading-none min-w-32"
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
              {connectedAccountId && (
                <button
                  disabled={accountLinkCreatePending}
                  className="flex items-center bg-foreground text-background text-[14px] px-2 py-3 font-medium rounded-[10px] min-w-32 leading-none"
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
            <div>
              <div>
                <div className="bg-background border border-gray-200 shadow-sm p-3 mt-3 rounded-lg">
                  <div className="flex flex-row items-center justify-between">
                    <div><p className="block font-bold text-foreground">How to start earning:</p></div>
                  </div>
                  <div className="relative pl-10 mt-5">
                    <p className="block font-bold text-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                           className="absolute top-0.5 left-1 h-5 w-5 text-foreground">
                        <path fillRule="evenodd"
                              d="M1 4a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4zm12 4a3 3 0 11-6 0 3 3 0 016 0zM4 9a1 1 0 100-2 1 1 0 000 2zm13-1a1 1 0 11-2 0 1 1 0 012 0zM1.75 14.5a.75.75 0 000 1.5c4.417 0 8.693.603 12.749 1.73 1.111.309 2.251-.512 2.251-1.696v-.784a.75.75 0 00-1.5 0v.784a.272.272 0 01-.35.25A49.043 49.043 0 001.75 14.5z"
                              clipRule="evenodd"></path>
                      </svg>
                      Create or link your Stripe Connect account
                    </p>
                    <span className="block  text-sm font-normal text-gray-700">Regulations require us to collect taxpayer information from our users. Create or link your Stripe Connect account to get started. Please note that until you complete this step, you will not be able to receive payments for any rewards you accumulate.</span>
                  </div>
                  <div className="relative pl-10 mt-5">
                    <p className="block font-bold text-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                           className="absolute top-0.5 left-1 h-5 w-5 text-amber-400">
                        <path fillRule="evenodd"
                              d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clipRule="evenodd"></path>
                      </svg>
                      Create or clone a NPC
                    </p>
                    <span className="block  text-sm font-normal text-gray-700">Create NPC</span>
                  </div>
                  <div className="relative pl-10 mt-5">
                    <p className="block font-bold text-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                           className="absolute top-0.5 left-1 h-5 w-5 text-foreground">
                        <path
                          d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.52 2.52 0 0113 4.5z"></path>
                      </svg>
                      Share your NPC in the NPC Library
                    </p>
                    <span className="block  text-sm font-normal text-gray-700">To share your NPC in the NPC Library, go to <a
                      className="underline text-black font-medium underline-offset-4" target="_blank" href="/app/npc-lab">My NPC</a> and click the sharing icon in the upper right-hand corner of any NPC you&#39;d like to share. Toggle &#39;Enable Financial Rewards&#39; during the sharing process and configure the rest of your settings there.</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:-mx-2">
                <div className="md:w-1/2 md:px-2">
                  <div className="bg-background border border-gray-200 shadow-sm p-3 mt-3 rounded-lg"><span
                    className="block  text-xs font-bold text-foreground">Current period</span><span
                    className="block  text-xs font-normal text-gray-700">Earnings</span>
                    <div className="flex flex-row items-end"><span
                      className="block  text-base font-bold text-foreground">$0.00</span><span
                      className="block  text-xs font-light text-gray-700 uppercase mb-[0.2rem] ml-[0.2rem]">USD</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 md:px-2">
                  <div className="bg-background border border-gray-200 shadow-sm p-3 mt-3 rounded-lg"><span
                    className="block  text-xs font-bold text-foreground">All time</span><span
                    className="block  text-xs font-normal text-gray-700">Payouts</span>
                    <div className="flex flex-row items-end"><span
                      className="block  text-base font-bold text-foreground">$0.00</span><span
                      className="block  text-xs font-light text-gray-700 uppercase mb-[0.2rem] ml-[0.2rem]">usd</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-center mt-3"><a className="underline underline-offset-4 text-black font-medium text-gray text-xs" target="_blank"
                                                           href="/vla">NPC Library Addendum to our Terms</a></div>
              <div className="bg-background border border-gray-200 shadow-sm px-3 pb-3 mt-3 rounded-lg">
                <div className="pt-3">
                  <dt className="text-lg">
                    <button className="flex w-full items-center justify-between text-left text-gray-400" type="button"
                            aria-expanded="false">
                      <div className="flex space-x-2"><p className="block font-bold text-foreground">Past Payouts</p>
                      </div>
                      <div className="ml-6 flex h-full items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" aria-hidden="true" className="rotate-0 h-6 w-6 transform">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
                        </svg>
                      </div>
                    </button>
                  </dt>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;