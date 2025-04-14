"use client";

import {useEffect, useState} from "react";
import {createSeries} from "@/app/_lib/actions";
import {useUser} from "@auth0/nextjs-auth0";
import Link from "next/link";
import {useParams} from "next/navigation";
import useSWRImmutable from "swr/immutable";

const Page = () => {
  const {user} = useUser();
  const {id} = useParams();
  const [series, setSeries] = useState<{
    name: string,
    price: string,
    description?: string,
    image?: string,
  }>({
    name: "",
    price: "",
    description: "",
    image: "",
  })
  const [status, setStatus] = useState("idle");
  const {data} = useSWRImmutable(`/api/series/${id}`, (url) => fetch(url).then(res => res.json()));

  return (
    <div className={"mx-auto p-8 relative min-h-screen w-full"}>
      <div className={"max-w-[1232px] mx-auto h-8"}>
        <div className={"text-xl font-bold"}>Edit a series</div>
      </div>
      <div className={"flex gap-8 mt-4 mb-[72px] justify-center"}>
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
        <div className={"w-full flex flex-col max-w-[600px] min-w-[300px]"}>
          <div>
            <div className={"font-bold mb-4 leading-5"}>
              Name
            </div>
            <input
              value={series.name}
              onChange={(e) => setSeries({...series, name: e.target.value})}
              placeholder={data?.product?.name}
              className={"border border-[#DBDBDB] rounded-xl px-3 py-2.5 w-full leading-5"}
            />
          </div>
          <div>
            <div className={"font-bold my-4 leading-5"}>
              Price(USD)
            </div>
            <input
              value={series.price}
              type={"number"}
              onChange={(e) => setSeries({...series, price: e.target.value})}
              placeholder={(data?.price?.unit_amount / 100).toFixed(2)}
              className={"border border-[#DBDBDB] rounded-xl px-3 py-2.5 w-full leading-5"}
            />
          </div>
          <div>
            <div className={"font-bold my-4 leading-5"}>
              Description
            </div>
            <input
              value={series.description}
              onChange={(e) => setSeries({...series, description: e.target.value})}
              placeholder={data?.product?.description}
              className={"border border-[#DBDBDB] rounded-xl px-3 py-2.5 w-full leading-5"}
            />
          </div>
          <div className={"flex justify-between my-4 items-center"}>
            <Link href={"/series"} prefetch
                  className={"font-bold text-[#0095F6] px-3 py-1 text-sm"}>
              Back
            </Link>
            <button
              disabled={status === "loading" || !series.name || !user}
              onClick={async () => {
                if (!user) return
                setStatus("loading");
                const {ok} = await createSeries({
                  owner: user.sub,
                  price: {
                    unit_amount: Math.floor(Number(series.price) * 100),
                    currency: "usd",
                  },
                  product: {
                    name: series.name,
                    description: series.description,
                    image: series.image,
                  }
                });
                if (ok) {
                  setStatus("success");
                  setSeries({
                    name: "",
                    price: "",
                    description: "",
                    image: "",
                  })
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
              className={"bg-[#0095F6] text-white w-60 h-11 font-bold rounded-lg flex items-center justify-center"}>
              {status === "loading" && "Loading..."}
              {status === "idle" && "Update"}
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