"use client";

import {useState} from "react";
import {createSeries} from "@/app/_lib/actions";

const Page = () => {
  const [series, setSeries] = useState({
    name: "",
    price: "",
    description: "",
    externalLink: "",
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
              Price*
            </div>
            <input
              value={series.price}
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
          <div>
            <div className={"font-bold mb-3"}>
              External link
            </div>
            <input
              value={series.externalLink}
              onChange={(e) => setSeries({...series, externalLink: e.target.value})}
              placeholder={"External link"}
              className={"border border-[#DBDBDB] rounded-xl px-4 h-12 w-full"}
            />
          </div>
          <div className={"flex flex-row-reverse"}>
            <button
              onClick={async () => {
                await createSeries()
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