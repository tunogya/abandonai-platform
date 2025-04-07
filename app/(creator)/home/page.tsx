import {auth0} from "@/app/_lib/auth0";
import {unauthorized} from "next/navigation";

const Page = async () => {
  const session = await auth0.getSession()

  if (!session) {
    unauthorized();
  }

  return (
    <div className={""}>
      <div>Home</div>
    </div>
  )
}

export default Page;