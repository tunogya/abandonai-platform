"use client";

import {useState} from "react";
import {createSeries} from "@/app/_lib/actions";
import {useUser} from "@auth0/nextjs-auth0";
import {redirect} from "next/navigation";

const Page = () => {
  const { user } = useUser();
  const [series, setSeries] = useState<{
    name: string,
    price: string,
    description?: string,
  }>({
    name: "",
    price: "",
    description: "",
  })

  return (
    <div className={"mx-auto p-8 relative min-h-screen w-full"}>
      <div className={"max-w-[1232px] mx-auto h-12"}>
        <div className={"text-3xl font-bold"}>Create a new series</div>
      </div>
      <div className={"flex gap-8 mt-8 mb-[72px] justify-center"}>
        <div className={"w-full max-w-[600px] min-w-[300px]"}>
          <button
            className={"border border-[#DBDBDB] rounded-xl border-dashed w-full aspect-square flex flex-col items-center justify-center"}>
            <div className={"font-bold"}>
              拖放媒体
            </div>
            <div>
              JPG、PNG、GIF、SVG、MP4
            </div>
          </button>
        </div>
        <div className={"w-full flex flex-col gap-[32px] max-w-[600px] min-w-[300px]"}>
          <div>
            <div className={"font-bold mb-3"}>
              Name*
            </div>
            <input
              value={series.name}
              onChange={(e) => setSeries({...series, name: e.target.value})}
              placeholder={"Series name"}
              className={"border border-[#DBDBDB] rounded-xl px-4 h-12 w-full"}
            />
          </div>
          <div>
            <div className={"font-bold mb-3"}>
              Price(usd)*
            </div>
            <input
              value={series.price}
              type={"number"}
              onChange={(e) => setSeries({...series, price: e.target.value})}
              placeholder={"Price"}
              className={"border border-[#DBDBDB] rounded-xl px-4 h-12 w-full"}
            />
          </div>
          <div>
            <div className={"font-bold mb-3"}>
              Description
            </div>
            <input
              value={series.description}
              onChange={(e) => setSeries({...series, description: e.target.value})}
              placeholder={"Description"}
              className={"border border-[#DBDBDB] rounded-xl px-4 h-12 w-full"}
            />
          </div>
          <div className={"flex flex-row-reverse"}>
            <button
              onClick={async () => {
                if (!user) return
                try {
                  await createSeries({
                    ...series,
                    owner: user.sub,
                    price: {
                      unit_amount: Math.floor(Number(series.price) * 100),
                      currency: "usd",
                    }
                  })
                  redirect("/series/create/success")
                } catch (e) {
                 console.log(e)
                  redirect("/series/create/error")
                }
              }}
              className={"hover:bg-foreground hover:text-background px-8 h-12 font-bold rounded-full border border-[#DBDBDB] flex items-center justify-center"}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page;