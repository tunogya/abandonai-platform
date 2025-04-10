"use client";

import {useEffect, useState} from "react";
import {createBox} from "@/app/_lib/actions";
import Link from "next/link";
import useSWR from "swr";
import {getAccessToken, useUser} from "@auth0/nextjs-auth0";

const Page = () => {
  const { user } = useUser();
  const [box, setBox] = useState({
    supply: "",
    description: "",
    series: "",
    image: "",
    name: "",
  });
  const [accessToken, setAccessToken] = useState("");
  const {data, isLoading} = useSWR(accessToken ? "/api/series": null, (url) => fetch(url, {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  }).then((res) => res.json()));
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessToken();
      setAccessToken(accessToken);
    })();
  }, []);

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
            <select
              value={box.series}
              onChange={(e) => {
                setBox({
                  ...box,
                  series: e.target.value,
                })
              }}
              className={"border border-[#DBDBDB] rounded-xl px-4 h-12 w-full mr-2"}
            >
              <option value={""}>
                {isLoading ? "Loading..." : "Select a series"}
              </option>
              {
                !isLoading && data?.Count > 0 && data?.Items?.map((item: any) => {
                  return (
                    <option key={item?.product?.id} value={item?.product?.id}>
                      {item?.product?.name}
                    </option>
                  )
                })
              }
            </select>
            <Link
              href={"/series/create"}
              prefetch
              className={"bg-[#1212120A] p-4 rounded-xl flex items-center gap-4 mt-3"}
            >
              <div className={"w-16 h-16 bg-[#1212120B] rounded-xl flex items-center justify-center text-xl"}>
                +
              </div>
              <div className={"font-bold"}>
                Create a new series
              </div>
            </Link>
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
          <div className={"flex flex-row-reverse"}>
            <button
              disabled={status === "loading" || !user || !user?.sub || !box.series || !box.supply || !box.name}
              onClick={async () => {
                if (!user || !user?.sub || !box.series || !box.supply || !box.name) {
                  return;
                }
                setStatus("loading");
                const {ok} = await createBox({
                  ...box,
                  owner: user.sub,
                  supply: Math.floor(Number(box.supply)),
                });
                if (ok) {
                  setStatus("success");
                  setBox({
                    supply: "",
                    description: "",
                    series: "",
                    image: "",
                    name: "",
                  });
                  setTimeout(() => {
                    setStatus("idle");
                  }, 3000);
                } else {
                  setStatus("error");
                  setTimeout(() => {
                    setStatus("idle");
                  }, 3000);
                }
              }}
              className={"bg-[#0095F6] text-white text-sm px-4 h-8 font-bold rounded-lg flex items-center justify-center"}>
              {status === "loading" && "Loading..."}
              {status === "idle" && "Create"}
              {status === "success" && "Success"}
              {status === "error" && "Error"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page;