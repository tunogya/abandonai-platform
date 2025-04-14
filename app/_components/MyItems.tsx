"use client";

import {FC, useEffect, useState} from "react";
import {User} from "@auth0/nextjs-auth0/types";
import useSWR from "swr";
import {getAccessToken} from "@auth0/nextjs-auth0";
import {Dialog, DialogPanel} from "@headlessui/react";

const MyItems: FC<{
  user?: User,
  series: number,
}> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [myItems, setMyItems] = useState([]);
  const { data } = useSWR(`/api/items/${props.series}`, async (url) => fetch(url, {
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`
    }
  }).then(res => res.json()), {
    refreshInterval: 5_000,
    dedupingInterval: 1_000,
  });
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

  useEffect(() => {
    if (data) {
      setMyItems(data);
    }
  }, [data]);

  return (
    <div className={"px-3 py-3"}>
      <div className={"font-semibold leading-5"}>My items</div>
      <div className={"flex flex-col mt-1 gap-1.5"}>
        {
          myItems && myItems?.map((item: {
            id: string,
            name: string,
            description?: string,
            image?: string,
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

export default MyItems;