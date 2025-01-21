"use client";
import {TelegramProvider, useTelegram} from "@/app/TelegramProvider";
import Link from "next/link";

const Page = () => {
  const {webApp} = useTelegram();

  const menu = [
    {
      name: "Video Call",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
        <path
          d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z"/>
      </svg>,
      link: "/tenant/call",
    },
    {
      name: "Transcribe",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
        <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z"/>
        <path
          d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z"/>
      </svg>,
      link: "/tenant/transcribe"
    },
    {
      name: "Memory",
      icon: "",
      link: "/tenant/memory",
    }
  ];

  return (
    <div
      className={"h-full overflow-scroll"}
      style={{
        paddingTop: (webApp?.contentSafeAreaInset.top || 0) + (webApp?.safeAreaInset.top || 0),
      }}
    >
      <div className={"px-6 py-4 h-full"}>
        <div className={"grid grid-cols-4 gap-x-4 justify-items-stretch"}>
          {
            menu.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                prefetch
                className={"flex flex-col items-center gap-2"}>
                <div
                  className={"w-[66px] h-[66px] rounded-[16px] dark:bg-[#202020] bg-[#FFFFFF] dark:text-[#BCBCBC] items-center justify-center flex"}>
                  {item.icon}
                </div>
                <div className={"text-[12px] select-none"}>{item.name}</div>
              </Link>
            ))
          }
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