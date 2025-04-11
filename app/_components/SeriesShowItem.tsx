"use client";

import {FC, useState} from "react";
import {Dialog, DialogBackdrop, DialogPanel} from "@headlessui/react";
import {deleteSeries} from "@/app/_lib/actions";
import { useRouter } from 'next/navigation';

const SeriesShowItem: FC<{
  item: {
    owner: string,
    product: {
      id: string,
      name: string,
    },
    price: {
      unit_amount: number,
      currency: string,
    }
  }
}> = ({item}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className={"flex flex-col w-[468px] mx-auto"}>
      <div className={"flex justify-between items-center pb-3"}>
        <div className={"flex-1"}>
          <div className={"text-sm font-bold"}>{item.product.name}</div>
          <div className={"text-xs text-[#666666]"}>{item.price.unit_amount / 100} {item.price.currency}</div>
        </div>
        <button onClick={() => setIsOpen(true)}>
          <svg aria-label="More options" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24"
               role="img" viewBox="0 0 24 24" width="24"><title>More options</title>
            <circle cx="12" cy="12" r="1.5"></circle>
            <circle cx="6" cy="12" r="1.5"></circle>
            <circle cx="18" cy="12" r="1.5"></circle>
          </svg>
        </button>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-black/65" transition/>
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="border bg-white w-[400px] rounded-xl text-sm divide-[#DBDBDB] divide-y">
              <button
                onClick={async () => {
                }}
                className={"h-12 w-full text-[#ED4956] font-bold"}>
                Edit
              </button>
              <button
                className={"h-12 font-bold w-full text-[#ED4956]"}
                onClick={async () => {
                  const {ok} = await deleteSeries({
                    owner: item.owner,
                    product: {
                      id: item.product.id,
                    }
                  });
                  if (ok) {
                    router.refresh();
                    setIsOpen(false);
                  }
                }}
              >
                Delete
              </button>
              <button
                onClick={async () => {
                  const shortId = item.product.id.split("_")[1]
                  await navigator.clipboard.writeText(window.location.origin + "/s/" + shortId);
                  setIsOpen(false);
                }}
                className={"h-12 w-full"}>
                Copy link
              </button>
              <button className={"h-12 w-full"} onClick={() => setIsOpen(false)}>
                Cancel
              </button>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
      <div className={"border border-[#DBDBDB] w-full rounded aspect-square"}>
      </div>
    </div>
  )
}

export default SeriesShowItem;