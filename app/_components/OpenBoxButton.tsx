"use client";

import {FC, useState} from "react";
import {openBox} from "@/app/_lib/actions";
import {User} from "@auth0/nextjs-auth0/types";
import {Dialog, DialogBackdrop, DialogPanel} from "@headlessui/react";
import {mutate} from "swr";
import {Item} from "@/app/_lib/types";

const OpenBoxButton: FC<{
  disabled: boolean,
  amount: number,
  customer?: string,
  series: string,
  owner: string,
  user?: User,
}> = (props) => {
  const [status, setStatus] = useState("idle");
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<Item>({
    id: "",
    name: "",
    description: "",
    image: "",
    createdAt: "",
    shared: false,
  });

  return (
    <>
      <button
        disabled={props.disabled}
        className={"h-11 w-full text-white font-bold flex items-center justify-center mx-auto"}
        style={{
          background: "linear-gradient(90deg, #7638FA 0%, #D300C5 25%, #FF0069 50%, #FF7A00 75%, #FFD600 100%)"
        }}
        onClick={async () => {
          if (!props.customer || !props.user?.sub) {
            return;
          }
          setStatus("loading");
          setIsOpen(true);
          const {item} = await openBox(props.amount, props.customer, props.series, props.owner, props.user);
          if (item) {
            setItem(item);
          }
          await Promise.all([
            mutate(`/api/series/${props.series}`),
            mutate(`/api/balance`),
            mutate(`/api/items/${props.series}`),
            mutate(`/api/logs/${props.series}`),
          ]);
          setStatus("idle");
        }}
      >
      <span className={status === "loading" ? "animate-pulse" : ""}>
         Open the box
      </span>
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg w-full bg-white rounded-xl overflow-hidden">
            {
              status === "loading" ? (
                <div className={"min-h-32 w-full px-3 py-4"}>
                  Open the box...
                </div>
              ) : (
                <div className={"w-full h-full"}>
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
                </div>
              )
            }
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
export default OpenBoxButton;