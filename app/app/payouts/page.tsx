"use client";

import {useEffect, useState} from "react";
import {getAccessToken} from "@auth0/nextjs-auth0";
import useSWR from 'swr'

const Page = () => {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState();
  const [accessToken, setAccessToken] = useState(undefined);
  const { data, isLoading } = useSWR(accessToken ? "/api/connect/account" : null, (url) => fetch(url, {
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
      <div>
        {!connectedAccountId && <h2>Get ready for take off</h2>}
        {connectedAccountId && <h2>Add information to start accepting money</h2>}
        {!accountCreatePending && !connectedAccountId && (
          <button
            disabled={isLoading}
            onClick={async () => {
              setAccountCreatePending(true);
              setError(false);
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

                  const { account, error } = json;

                  if (account) {
                    setConnectedAccountId(account);
                  }

                  if (error) {
                    setError(true);
                  }
                });
            }}
          >
            Create an account!
          </button>
        )}
        {connectedAccountId && !accountLinkCreatePending && (
          <button
            onClick={async () => {
              setAccountLinkCreatePending(true);
              setError(false);
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

                  const { url, error } = json;
                  if (url) {
                    window.location.href = url;
                  }

                  if (error) {
                    setError(true);
                  }
                });
            }}
          >
            Add information
          </button>
        )}
        {error && <p className="error">Something went wrong!</p>}
        {(connectedAccountId || accountCreatePending || accountLinkCreatePending) && (
          <div>
            {connectedAccountId && <p>Your connected account ID is: <code className="bold">{connectedAccountId}</code></p>}
            {accountCreatePending && <p>Creating a connected account...</p>}
            {accountLinkCreatePending && <p>Creating a new Account Link...</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;