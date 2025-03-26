"use client";
import {ChevronDownIcon} from "@heroicons/react/16/solid";
import {useEffect, useState} from "react";
import {
  Dialog,
  DialogPanel,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Textarea
} from "@headlessui/react";
import clsx from 'clsx';
import {getAccessToken } from "@auth0/nextjs-auth0";
import useSWR from "swr";

const Content = () => {
  const [tab, setTab] = useState("All");
  const TABS = ["All", "Personal", "Community", "Default"];
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instruction, setInstruction ] = useState("");
  const [accessToken, setAccessToken] = useState(undefined);
  const { data } = useSWR(accessToken ? "/api/npc" : null, (url) => fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then((res) => res.json()));

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessToken();
      setAccessToken(accessToken);
    })();
  }, []);

  const createNPC = async () => {
    const response = await fetch("/api/npc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        name,
        description,
        instruction,
      }),
    });

    if (response.ok) {
      setName("");
      setDescription("");
      setInstruction("");
      setIsOpen(false);
    }
  }

  return (
    <div className={"flex flex-col gap-3 pt-5"}>
      <div className={"flex gap-3 px-5 3xl:px-4 h-9"}>
        <input
          className={"flex h-9 w-full rounded-[10px] border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-1 text-sm shadow-none transition-colors placeholder:text-subtle focus-ring focus-visible:border-foreground focus-visible:ring-[0.5px] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 flex-1"}
          placeholder={"Search my NPC..."}
        />
        <button className={"border w-40 rounded-[10px] border-gray-200 dark:border-gray-800 text-sm font-medium text-start pl-3 pr-2 py-2 flex items-center"}>
          <div className={"whitespace-nowrap"}>
            Recent
          </div>
          <ChevronDownIcon className={"w-4 h-4 ml-auto text-gray-500"} />
        </button>
        <button className={"border w-40 rounded-[10px] border-gray-200 dark:border-gray-800 text-sm font-medium text-start pl-3 pr-2 py-2 flex items-center"}>
          <div className={"whitespace-nowrap"}>
            NPC type
          </div>
          <ChevronDownIcon className={"w-4 h-4 ml-auto text-gray-500"} />
        </button>
      </div>
      <div className={"w-full px-5 3xl:px-4"}>
        <div className={"flex h-9 p-1 px-1 gap-1"}>
          {
            TABS.map((item) => (
              <button
                key={item}
                className={`flex items-center justify-center px-3 h-full text-sm font-medium rounded-full ${tab === item ? "text-black bg-gray-100" : "text-gray-500"}`}
                onClick={() => setTab(item)}
              >
                {item}
              </button>
            ))
          }
        </div>
      </div>
      <div className={"md:flex flex items-center justify-between gap-6 px-5 pt-0 pb-5 border-b border-gray-200 dark:border-gray-800"}>
        <div className="hstack items-center gap-3"><p
          className="text-sm text-subtle font-normal line-clamp-1 text-gray-500"><span
          className="text-sm font-medium mr-1 text-black dark:text-white">Create or clone a new NPC</span> (2 / 3 slots used)
        </p></div>
        <button
          onClick={() => setIsOpen(true)}
          className={"relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-200 focus-ring disabled:pointer-events-auto bg-foreground text-background shadow-none hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-400 disabled:text-gray-100 h-9 px-[12px] rounded-[10px] w-fit"}>
          Add a new NPC
        </button>
        <Dialog open={isOpen} as="div" className="z-10" onClose={() => setIsOpen(false)}>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel
                transition
                className="w-full max-w-md rounded-xl p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 border bg-background"
              >
                <Fieldset className="space-y-3 rounded-xl ">
                  <Legend className="text-base/7 font-semibold ">NPC Builder</Legend>
                  <Field>
                    <Label className="text-sm/6 font-medium">NPC name</Label>
                    <Input
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      className={clsx(
                        'mt-3 block w-full rounded-lg border-none py-1.5 px-3 text-sm/6 bg-gray-100',
                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                      )}
                    />
                  </Field>
                  <Field>
                    <Label className="text-sm/6 font-medium">Description</Label>
                    <Textarea
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      className={clsx(
                        'mt-3 block w-full rounded-lg border-none  py-1.5 px-3 text-sm/6 bg-gray-100',
                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                      )}
                    />
                  </Field>
                  <Field>
                    <Label className="text-sm/6 font-medium">Instruction</Label>
                    <Textarea
                      onChange={(e) => setInstruction(e.target.value)}
                      value={instruction}
                      className={clsx(
                        'mt-3 block w-full rounded-lg border-none  py-1.5 px-3 text-sm/6 bg-gray-100',
                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                      )}
                    />
                  </Field>
                </Fieldset>
                <div className="mt-4">
                  <button
                    disabled={!name || !description || !instruction}
                    className="items-center w-full gap-2 rounded-md bg-foreground text-background py-1.5 px-3 text-sm/6 font-semibold shadow-inner shadow-white/10 disabled:bg-gray-200"
                    onClick={createNPC}
                  >
                    Create
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>
      <div>
        {
          data?.items && data?.items?.map((item: any, index: number) => (
            <div key={index} className={"w-full h-14 px-5 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center line-clamp-1 font-medium text-sm"}>
              {item.agentName}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Content;