import {FC} from "react";
import stripe from "@/app/_lib/stripe";
import {redirect} from "next/navigation";

const ManageConnectAccount: FC<{
  connectedAccountId: string
}> = async ({...props}) => {
  return (
    <form action={async () => {
      "use server";
      const accountLink = await stripe.accountLinks.create({
        account: props.connectedAccountId,
        refresh_url: `${process.env.APP_BASE_URL}/accounts/refresh/${props.connectedAccountId}`,
        return_url: `${process.env.APP_BASE_URL}/accounts`,
        type: "account_onboarding",
      });
      redirect(accountLink.url);
    }}>
      <button
        className={"px-4 text-[15px] rounded-full h-11 font-semibold flex items-center border border-[#DBDBDB]"}
        type={"submit"}
      >
        Manage Account
      </button>
    </form>
  )
}

export default ManageConnectAccount;