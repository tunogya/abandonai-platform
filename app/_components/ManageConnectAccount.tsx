"use client";

import {FC, useState} from "react";

const ManageConnectAccount: FC<{
  connectedAccountId: string
}> = ({...props}) => {
  const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);

  return (
    <button
      disabled={accountLinkCreatePending}
      className={"px-4 text-[15px] rounded-full h-11 font-semibold flex items-center border border-[#DBDBDB]"}
      onClick={async () => {
        setAccountLinkCreatePending(true);
        fetch("/api/connect/account_link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            account: props.connectedAccountId,
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
      Manage Account
    </button>
  )
}

export default ManageConnectAccount;