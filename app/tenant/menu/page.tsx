"use client";

const Page = () => {
  return (
    <div
      className={"h-full overflow-scroll"}
      style={{
        paddingTop: "calc(var(--tg-content-safe-area-inset-top) + var(--tg-safe-area-inset-top))",
      }}
    >
      <div className={"px-6 py-4 h-full"}>
        <div className={"grid grid-cols-4 gap-x-4 justify-items-stretch"}>
          <div className={"flex flex-col items-center gap-2"}>
            <div
              className={"w-[66px] h-[66px] rounded-[16px] dark:bg-[#202020] bg-[#FFFFFF] dark:text-[#BCBCBC] items-center justify-center flex"}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                <path
                  d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z"/>
              </svg>
            </div>
            <div className={"text-[12px]"}>Video Call</div>
          </div>
        </div>
        <div style={{
          height: "calc(var(--tg-content-safe-area-inset-bottom) + var(--tg-safe-area-inset-bottom))",
        }}/>
      </div>
    </div>
  )
}

export default Page;