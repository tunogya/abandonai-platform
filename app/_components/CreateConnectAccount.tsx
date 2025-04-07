"use client";

import {useState} from "react";

const CreateConnectAccount = () => {
  const [accountCreatePending, setAccountCreatePending] = useState(false);

  return (
    <button
      className={"px-4 text-[15px] rounded-full h-11 font-semibold flex items-center border border-[#DBDBDB]"}
      disabled={accountCreatePending}
      onClick={async () => {
        setAccountCreatePending(true);
        fetch("/api/connect/account", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => response.json())
      }}
    >
      Create an account
    </button>
  )
}

export default CreateConnectAccount;
