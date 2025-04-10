import SideBar from "@/app/_components/SideBar";
import {auth0} from "@/app/_lib/auth0";
import {unauthorized} from "next/navigation";

const Layout = async ({
                  children,
                }: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth0.getSession();
  if (!session) {
    unauthorized();
  }

  return (
    <div className={"flex"}>
      <SideBar />
      <main className={"ml-[245px] flex-1 overflow-y-auto bg-background"}>
        {children}
      </main>
    </div>
  )
}

export default Layout