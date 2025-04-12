"use client";
import {useChat} from '@ai-sdk/react';
import clsx from "clsx";
import {useTranslations} from "next-intl";
import {useEffect, useState} from "react";
import {getAccessToken} from "@auth0/nextjs-auth0";
import {AutoResizeTextarea} from "@/app/_components/AutoResizeTextarea";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const Page = () => {
  const [accessToken, setAccessToken] = useState("");
  const {messages, input, handleSubmit, handleInputChange, status, error, setMessages, stop} = useChat({
    headers: {
      "Authorization": `Bearer ${accessToken}`
    },
  });
  const t = useTranslations("Home");

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessToken();
      setAccessToken(accessToken);
    })();
  }, []);

  return (
    <div className={"flex flex-col w-full h-screen"}>
      <div className={"flex flex-1 flex-col grow overflow-hidden"}>
        <div className={"pb-9 mt-1.5 h-full overflow-y-auto"}>
          {
            messages.length === 0 && (
              <div className={"text-center text-2xl font-semibold h-full flex items-center justify-center"}>
                {t("title")}
              </div>
            )
          }
          {messages.map(message => (
            <div key={message.id} className={"px-6 my-2.5"}>
              <div
                className={`flex ${message.role === "user" ? "flex-row-reverse" : ""} md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] mx-auto`}>
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case 'text':
                      return <div key={index} className={clsx([
                        "rounded-[18px] py-1.5 break-words overflow-hidden",
                        message.role === "user" ? "bg-[#3797F0] text-white px-4" : "",
                      ])}>
                        <Markdown remarkPlugins={[remarkGfm]}>{part.text}</Markdown>
                      </div>;
                  }
                })}
              </div>
            </div>
          ))}
          <div className={"md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] mx-auto"}>
            {(status === "submitted" || status === "streaming") && (
              <div className={"text-xs font-semibold text-[#65676B]"}>typing...</div>
            )}
            {status === "error" && (
              <div>
                {error?.name}: {error?.message}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={"w-full flex flex-col md:pt-0 md:border-transparent dark:border-white/20 md:dark:border-transparent"}>
        <div className={"flex items-center justify-center gap-1.5"}>
          {
            status === "ready" && (
              <button
                disabled={status !== "ready"}
                onClick={() => {
                  setMessages([]);
                }}
                className={"px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#DBDBDB] mt-1.5"}>
                New chat
              </button>
            )
          }
          {
            (status === "streaming" || status === "submitted") && (
              <button
                onClick={stop}
                className={"px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#DBDBDB] mt-1.5"}>
                Stop
              </button>
            )
          }
        </div>
        <div className={"text-base mx-auto px-3 pt-1.5 md:px-4 w-full lg:px-4 xl:px-5"}>
          <div
            className={"mx-auto flex flex-1 text-base gap-4 md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]"}>
            <form onSubmit={handleSubmit}
                  className={"w-full border border-[#DBDBDB] rounded-[22px] px-4 py-2 flex items-center min-h-11"}>
              <AutoResizeTextarea
                value={input}
                autoFocus={true}
                disabled={status !== 'ready'}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={"Send a message..."}
                className={"w-full active:border-none active:outline-none focus:outline-none focus:border-none text-base placeholder-[#65676B] bg-transparent leading-6"}
              />
            </form>
          </div>
        </div>
        <div
          className={"text-[#65676B] relative mt-auto flex min-h-8 w-full items-center justify-center p-2 text-center text-xs md:px-[60px]"}>
          {t("tips")}
        </div>
      </div>
    </div>
  )
}

export default Page;