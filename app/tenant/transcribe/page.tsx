"use client";
import {TelegramProvider, useTelegram} from "@/app/TelegramProvider";
import {useEffect} from "react";

const Page = () => {
  const {webApp} = useTelegram();

  useEffect(() => {
    const resize = () => {
      try {
        if (!window?.Telegram?.WebApp?.isFullscreen) {
          window.Telegram.WebApp.requestFullscreen()
          window.Telegram.WebApp.expand()
          window.location.reload()
        }
      } catch (e) {
        console.log(e)
      }
    }
    resize();
  }, []);

  // 只能在全屏状态下显示
  // if (!webApp?.isFullscreen) {
  //   return null
  // }

  return (
    <div className={"h-screen overflow-hidden flex flex-col bg-[#D6412D]"}>
      <div style={{
        height: (webApp?.safeAreaInset.top || 0) + (webApp?.contentSafeAreaInset.top || 0)
      }}
      />
      <div className={"flex justify-between p-8 min-h-[100px]"}>
        <button className={"text-white bg-black bg-opacity-35 w-8 h-8 rounded-full flex items-center justify-center"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
               stroke="currentColor" className="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
          </svg>
        </button>
        <button className={"text-white w-8 h-8 rounded-full flex items-center justify-center"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
               stroke="currentColor" className="size-6">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"/>
          </svg>
        </button>
      </div>
      <div
        className={"flex items-center justify-center flex-1 px-8 py-2 overflow-scroll"}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className={"w-full h-full flex flex-col"}>
          <div className={"flex-1 text-white font-bold text-[24px]"}>

            <div className={"h-[200px]"} />
          </div>
        </div>
      </div>
      <div className={"w-full px-10 py-4"}>
        <div className={"flex justify-center"}>
          <button
            className={"h-[66px] w-[66px] rounded-full flex items-center justify-center bg-[#FFFFFF] text-[#D6412D]"}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fill-rule="evenodd"
                    d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                    clip-rule="evenodd"/>
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