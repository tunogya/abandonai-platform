import TheNavigation from "@/app/_components/TheNavigation";

const Layout = ({
                  children,
                }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className={"relative h-full"}>
      <TheNavigation />
      {children}
    </div>
  )
}

export default Layout