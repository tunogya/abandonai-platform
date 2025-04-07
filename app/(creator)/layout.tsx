import SideBar from "@/app/_components/SideBar";

const Layout = ({
                  children,
                }: Readonly<{
  children: React.ReactNode;
}>) => {
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