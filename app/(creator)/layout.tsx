const Layout = ({
                  children,
                }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className={"relative"}>
      <div className={"w-full pl-64"}>
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout