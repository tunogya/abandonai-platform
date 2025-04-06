import {auth0} from "@/app/_lib/auth0";
import {unauthorized} from "next/navigation";

const Page = async () => {
  const session = await auth0.getSession()

  if (!session) {
    unauthorized();
  }

  return (
    <div className={"max-w-screen-lg mx-auto py-20 flex flex-col gap-8"}>
    </div>
  )
}

export default Page;