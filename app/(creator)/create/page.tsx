"use client";

import {useState} from "react";
import {createBox} from "@/app/_lib/actions";
// import {useUser} from "@auth0/nextjs-auth0";

const Page = () => {
  // const { user } = useUser();
  const [box, setBox] = useState({
    supply: "",
    description: "",
    externalLink: "",
    series: "",
    image: "",
    name: "",
  });

  return (
    <div className={"mx-auto p-8 relative min-h-screen w-full"}>
      <div className={"max-w-[1232px] mx-auto h-12"}>
        <div className={"text-3xl font-bold"}>Create a new box</div>
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
              Series*
            </div>
            <div className={"bg-[#1212120A] p-4 rounded-xl flex items-center gap-4"}>
              <div className={"w-16 h-16 bg-[#1212120B] rounded-xl flex items-center justify-center text-xl"}>
                +
              </div>
              <div className={"font-bold"}>
                Create a new series
              </div>
            </div>
          </div>
          <div>
            <div className={"font-bold mb-3"}>
              Name*
            </div>
            <input
              value={box.name}
              onChange={(e) => {
                setBox({
                  ...box,
                  name: e.target.value,
                })
              }}
              placeholder={"Box name"}
              className={"border border-[#DBDBDB] rounded-xl px-4 h-12 w-full"}
            />
          </div>
          <div>
            <div className={"font-bold mb-3"}>
              Supply*
            </div>
            <input
              value={box.supply}
              onChange={(e) => {
                setBox({
                  ...box,
                  supply: e.target.value,
                })
              }}
              placeholder={"Supply"}
              className={"border border-[#DBDBDB] rounded-xl px-4 h-12 w-full"}
            />
          </div>
          <div>
            <div className={"font-bold mb-3"}>
              Description
            </div>
            <input
              value={box.description}
              onChange={(e) => {
                setBox({
                  ...box,
                  description: e.target.value,
                })
              }}
              placeholder={"Description"}
              className={"border border-[#DBDBDB] rounded-xl px-4 h-12 w-full"}
            />
          </div>
          <div>
            <div className={"font-bold mb-3"}>
              External link
            </div>
            <input
              value={box.externalLink}
              onChange={(e) => {
                setBox({
                  ...box,
                  externalLink: e.target.value,
                })
              }}
              placeholder={"External link"}
              className={"border border-[#DBDBDB] rounded-xl px-4 h-12 w-full"}
            />
          </div>
          <div className={"flex flex-row-reverse"}>
            <button
              onClick={async () => {
                await createBox();
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