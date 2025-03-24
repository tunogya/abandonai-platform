const Page = () => {
  return (
    <div className={"flex flex-col"}>
      <header
        className="z-[10] h-16 border-b">
        <div
          className="h-full w-full mx-auto flex items-center gap-3.5 bg-background/90 backdrop-blur-[8px] max-w-[calc(105rem)] px-5">
          <div><h3 data-testid="page-title"
                   className="text-lg text-foreground font-semibold">Subscription</h3></div>
        </div>
      </header>
      <div className={"px-5"}>
        <script async src={"https://js.stripe.com/v3/pricing-table.js"}></script>
        <div className="flex flex-col items-center mt-4 mb-4">
          <div className="rounded-lg w-full bg-background border divide-y">
            <div className="flex max-sm:flex-col justify-between items-center max-sm:items-start gap-3 px-6 py-4"><span
              className="font-semibold inter text-base black">Subscription Details</span>
              <div
                className="max-sm:w-full flex md:items-center space-x-0 md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
                <button
                  className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-200 focus-ring disabled:pointer-events-auto bg-background/20 border border-subtle text-foreground shadow-none hover:bg-gray-50 active:bg-gray-100 disabled:bg-background disabled:text-gray-400 h-9 px-[12px] rounded-[10px]">Manage
                  billing info
                </button>
              </div>
            </div>
            <div className="flex gap-4 px-6 py-4 items-center"><span className="font-medium inter text-sm text-gray-700">Current Plan</span>
              <div
                className="inline-flex items-center text-xs px-2.5 h-6 rounded-full font-medium transition-colors whitespace-nowrap focus-ring border border-transparent bg-gray-100 text-foreground">Free
              </div>
            </div>
            <div className="gap-4 px-6 py-4 items-center block"><span className="font-medium inter text-sm text-gray-700">Credit Usage</span><span
              className="font-medium inter text-right block text-xs text-gray-500 mb-3 max-sm:hidden">0/10,000 used (Resets in 19 days)</span>
              <div className="bg-gray-200 h-[6px] rounded-full max-sm:mt-3 w-full"></div>
              <span className="font-medium inter text-left block text-xs text-gray-500 mt-3 sm:hidden">0/10,000 used (Resets in 19 days)</span>
            </div>
          </div>
        </div>
        <div className={"font-bold text-foreground text-4xl max-sm:text-2xl inter pt-16"}>
          Plans built for creators and businesses of all sizes
        </div>
        <div className={"pt-6"}>
          {/* @ts-ignore*/}
          <stripe-pricing-table pricing-table-id="prctbl_1R5DSHFPRjptKGExT3P3TgNb"
            // @ts-ignore
                                publishable-key="pk_test_51R4l0JFPRjptKGExv3qKKRzHirgSUbMDEXyyvFUSXG5wtJHUoR0xoOTQvm2rFK58JENY2GlsfJR5Yjv1HH9ubO5100KotagW6I"></stripe-pricing-table>
        </div>
        <div className={"block font-sans text-3xl font-semibold text-foreground mb-6 mt-36"}>
          Frequently asked questions
        </div>
      </div>
    </div>
  )
}

export default Page;