"use client";

import {FC, useState} from "react";
import useSWR from "swr";
import {getAccessToken} from "@auth0/nextjs-auth0";
import {Dialog, DialogPanel} from "@headlessui/react";

const RecentLogs: FC<{
  series: string
}> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useSWR(`/api/logs/${props.series}`, async (url) => fetch(url, {
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`
    }
  }).then(res => res.json()));
  const [item, setItem] = useState<{
    id: string;   name: string;   description?: string | undefined;   image?: string | undefined;   shared: boolean;   createdAt: string;
  }>({
    id: "",
    name: "",
    description: "",
    image: "",
    shared: false,
    createdAt: ""
  })

  return (
    <div className={"px-3 py-3"}>
      <div className={"font-semibold leading-5"}>Recently</div>
      <div className={"flex flex-col mt-1 gap-1.5"}>
        {
          data && data?.map((item: {
            id: string,
            name: string,
            description: string,
            shared: boolean,
            createdAt: string
          }) => (
            <button
              key={item.id}
              className={"h-20 w-full border border-[#DBDBDB] rounded-lg flex items-center justify-center"}
              onClick={() => {
                setItem(item)
                setIsOpen(true);
              }}
            >
              {item.name}
            </button>
          ))
        }
      </div>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <div>
              {item.name}
            </div>
            <div>
              {item.description}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default RecentLogs;