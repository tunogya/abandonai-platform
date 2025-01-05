"use client";
import {TelegramProvider, useTelegram} from "@/app/TelegramProvider";
import {useEffect} from "react";

const Page = () => {
  const {webApp} = useTelegram();

  // The page need full screen
  const resize = () => {
    if (!webApp?.isExpanded) {
      webApp?.expand()
    }
    if (!webApp?.isFullscreen) {
      webApp?.requestFullscreen()
      window.location.reload();
    }
  }

  useEffect(() => {
    resize()
  }, [webApp]);

  return (
    <div className={"h-screen overflow-hidden flex flex-col"}>
      <div style={{
        height: (webApp?.safeAreaInset.top || 0) + (webApp?.contentSafeAreaInset.top || 0)
      }}
      />
      <div className={"flex justify-end p-3"}>
        <button className={"p-2"}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path
              d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"/>
          </svg>
        </button>
      </div>
      <div className={"flex items-center justify-center flex-1"}>
        <div className={"h-[180px] w-[180px] rounded-full bg-blue-200"}></div>
      </div>
      <div className={"w-full px-10 py-4"}>
        <div className={"flex justify-between"}>
          <button
            className={"h-[66px] w-[66px] rounded-full flex items-center justify-center dark:bg-[#202020] bg-[#FFFFFF] dark:text-[#BCBCBC]"}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z"/>
              <path
                d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z"/>
            </svg>
          </button>
          <button
            onClick={() => {
              webApp?.showConfirm("Do you want to end the call?", (confirmed: boolean) => {
                if (confirmed) {
                  webApp?.close()
                }
              })
            }}
            className={"h-[66px] w-[66px] rounded-full flex items-center justify-center dark:bg-[#202020] bg-[#FFFFFF] dark:text-[#BCBCBC]"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                 stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div style={{
          height: (webApp?.contentSafeAreaInset.bottom || 0) + (webApp?.safeAreaInset.bottom || 0),
        }}/>
      </div>
    </div>
  )
}

const Wrap = () => {
  return (
    <TelegramProvider>
      <Page/>
    </TelegramProvider>
  )
}

export default Wrap;