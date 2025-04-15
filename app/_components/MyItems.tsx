"use client";

import {FC, useEffect, useState} from "react";
import {User} from "@auth0/nextjs-auth0/types";
import useSWR from "swr";
import {Dialog, DialogBackdrop, DialogPanel} from "@headlessui/react";
import {Item} from "@/app/_lib/types";
import {getMyItems} from "@/app/_lib/actions";

const MyItems: FC<{
  user?: User,
  series: string,
}> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [myItems, setMyItems] = useState<Item[]>([]);
  const { data } = useSWR(props?.user?.sub ? `/api/items/${props.series}` : null, () => getMyItems(props.series, props?.user?.sub), {
    refreshInterval: 5_000,
    dedupingInterval: 1_000,
  });
  const [item, setItem] = useState<Item>({
    id: "",
    name: "",
    description: "",
    image: "",
    shared: false,
    createdAt: ""
  })

  useEffect(() => {
    if (data?.items) {
      // @ts-ignore
      setMyItems(data.items);
    }
  }, [data]);

  return (
    <div className={"px-3 py-3"}>
      <div className={"font-semibold leading-5"}>My items</div>
      <div className={"flex flex-col mt-1 gap-1.5"}>
        {
          myItems && myItems?.map((item: Item) => (
            <button
              key={item.id}
              className={"h-20 w-full border border-[#DBDBDB] rounded-lg flex items-center justify-center font-bold flex-col leading-5"}
              onClick={() => {
                setItem(item)
                setIsOpen(true);
              }}
            >
              <div>
                {item.name}
              </div>
              <div className={"text-xs italic px-3"}>#{item.id.slice(0, 5)}</div>
            </button>
          ))
        }
      </div>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg w-full bg-white rounded-xl overflow-hidden shadow">
            <div>
              {
                item?.image && (
                  <img src={item.image} alt={item.name} className={"w-full h-full"} />
                )
              }
            </div>
            <div className={"px-3 py-4 min-h-32"}>
              <div className={"font-bold leading-5"}>
                {item.name}
              </div>
              <div className={"leading-5"}>
                {item.description}
              </div>
              <div className={"text-xs pt-3 text-[#DBDBDB]"}>
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default MyItems;