"use client";
import {useChat} from '@ai-sdk/react';
import clsx from "clsx";

const Page = () => {
  const {messages, input, handleSubmit, handleInputChange, status} = useChat();

  return (
    <div className={"flex flex-col w-full h-screen"}>
      <div className={"flex flex-1 flex-col grow overflow-hidden"}>
        <div className={"pb-9 mt-1.5"}>
          {messages.map(message => (
            <div key={message.id} className={"px-6 my-2.5"}>
              <div
                className={`flex ${message.role === "user" ? "flex-row-reverse" : ""} md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] mx-auto`}>
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case 'text':
                      return <span key={index} className={clsx([
                        "rounded-[18px] px-4 py-1.5 text-[15px]",
                        message.role === "user" ? "bg-[#3797F0] text-white" : "bg-[#EFEFEF]",
                      ])}>{part.text}</span>;
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className={"w-full flex flex-col md:pt-0 md:border-transparent dark:border-white/20 md:dark:border-transparent"}>
        <div>
          <div className={"text-base mx-auto px-3 md:px-4 w-full lg:px-4 xl:px-5"}>
            <div
              className={"mx-auto flex flex-1 text-base gap-4 md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]"}>
              <form onSubmit={handleSubmit} className={"w-full border border-[#DBDBDB] rounded-full px-4 py-2"}>
                <input
                  value={input}
                  autoFocus={true}
                  placeholder="Send a message..."
                  onChange={handleInputChange}
                  disabled={status !== 'ready'}
                  className={"w-full active:border-none active:outline-none focus:outline-none focus:border-none text-base placeholder-[#65676B]"}
                />
              </form>
            </div>
          </div>
        </div>
        <div
          className={"text-[#65676B] relative mt-auto flex min-h-8 w-full items-center justify-center p-2 text-center text-xs md:px-[60px]"}>
          AI 也可能会犯错。请核查重要信息。
        </div>
      </div>
    </div>
  )
}

export default Page;