"use client";
import React, { useState, useEffect } from "react";
import {getAccessToken} from "@auth0/nextjs-auth0";
import {useParams} from "next/navigation";

const Page = () => {
  const params = useParams()
  const connectedAccountId = params.id;
  const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);
  const [error, setError] = useState(false);
  const [accessToken, setAccessToken] = useState(undefined);

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessToken();
      setAccessToken(accessToken);
    })();
  }, []);

  useEffect(() => {
    if (accessToken && connectedAccountId) {
      setAccountLinkCreatePending(true);
      fetch("/api/connect/account_link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
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
    }
  }, [accessToken, connectedAccountId])

  return (
    <div className="container">
      <div className="banner">
        <h2>ABANDON INC.</h2>
      </div>
      <div className="content">
        <h2>Add information to start accepting money</h2>
        {error && <p className="error">Something went wrong!</p>}
      </div>
      <div className="dev-callout">
        {accountLinkCreatePending && <p>Creating a new Account Link...</p>}
      </div>
    </div>
  )
}

export default Page;