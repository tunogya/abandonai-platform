"use client";
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
import {
  ArrowPathIcon,
  ArrowLeftEndOnRectangleIcon,
  ChevronDownIcon,
  ArrowRightEndOnRectangleIcon, TrashIcon, DocumentDuplicateIcon
} from "@heroicons/react/24/outline";
import {useRouter, useSearchParams} from "next/navigation";

const Content = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState("All");
  const TABS = ["All", "Personal", "Community", "Default"];
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instruction, setInstruction ] = useState("");
  const [status, setStatus] = useState("idle");
  const [accessToken, setAccessToken] = useState(undefined);
  const { data, mutate } = useSWR(accessToken ? "/api/npc" : null, (url) => fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then((res) => res.json()));
  const { data: npcData, mutate: npcMutate } = useSWR((accessToken && searchParams.get("npcId")) ? `/api/npc/${searchParams.get("npcId")}` : null, (url) => fetch(url, {
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
    setStatus("loading");
    try {
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
        setStatus("success")
        setName("");
        setDescription("");
        setInstruction("");
        setIsOpen(false);
      }
    } catch (e) {
      setStatus("error")
      console.log(e);
    } finally {
      setTimeout(() => {
        mutate();
        setStatus("idle");
      }, 1000);
    }
  }

  const deleteNPC = async () => {
    setStatus("loading");
    try {
      const response = await fetch(`/api/npc/${searchParams.get("npcId")}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
      });

      if (response.ok) {
        setStatus("success")
        router.push("/app/npc-lab");
      }
    } catch (e) {
      setStatus("error")
      console.log(e);
    } finally {
      setTimeout(() => {
        mutate();
        setStatus("idle");
      }, 1000);
    }
  }

  const prepareNPC = async () => {
    setStatus("loading");
    try {
      const response = await fetch(`/api/npc/${searchParams.get("npcId")}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          action: "PREPARE",
        })
      });

      if (response.ok) {
        setStatus("success")
      }
    } catch (e) {
      setStatus("error")
      console.log(e);
    } finally {
      setTimeout(() => {
        npcMutate();
        setStatus("idle");
      }, 1000);
    }
  }

  return (
    <div className={"flex flex-1"}>
      <div className={"flex flex-col gap-3 pt-5 flex-1"}>
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
            className="text-sm font-medium mr-1 text-black dark:text-white">Create or clone a new NPC</span> ({data?.items?.length || 0} / 3 slots used)
          </p></div>
          <button
            disabled={data?.items?.length >= 3}
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
                      <Label className="text-sm/6 font-medium">Username</Label>
                      <Input
                        onChange={(e) => {
                          // only accept ([0-9a-zA-Z][_-]?){1,100}
                          if ((e.target.value.length > 0 && !e.target.value.match(/^([0-9a-zA-Z][_-]?){1,100}$/)) || e.target.value.length > 100) {
                            return;
                          }
                          setName(e.target.value)
                        }}
                        value={name}
                        placeholder={"([0-9a-zA-Z][_-]?){1,100}"}
                        className={clsx(
                          'mt-1 block w-full rounded-lg border-none py-1.5 px-3 text-sm/6 bg-gray-100',
                          'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                        )}
                      />
                    </Field>
                    <Field>
                      <Label className="text-sm/6 font-medium">Description</Label>
                      <Textarea
                        placeholder={"Option"}
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className={clsx(
                          'mt-1 block w-full rounded-lg border-none  py-1.5 px-3 text-sm/6 bg-gray-100',
                          'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                        )}
                      />
                    </Field>
                    <Field>
                      <Label className="text-sm/6 font-medium">Instruction</Label>
                      <Textarea
                        placeholder={"must have length greater than or equal to 40"}
                        onChange={(e) => setInstruction(e.target.value)}
                        value={instruction}
                        className={clsx(
                          'mt-1 block w-full rounded-lg border-none  py-1.5 px-3 text-sm/6 bg-gray-100',
                          'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                        )}
                      />
                    </Field>
                  </Fieldset>
                  <div className="mt-4">
                    <button
                      disabled={!name || !description || !instruction || instruction.length < 40 || status !== "idle"}
                      className="items-center w-full gap-2 rounded-md bg-foreground text-background py-1.5 px-3 text-sm/6 font-semibold shadow-inner shadow-white/10 disabled:bg-gray-200"
                      onClick={createNPC}
                    >
                      {status === "loading" ? "loading..." : "Create"}
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
              <div key={index} className={"w-full h-14 px-5 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between"}>
                <div className={"flex flex-col"}>
                  <div className={"line-clamp-1 font-semibold text-sm"}>
                    @{item.name}
                  </div>
                  {
                    item.description && (
                      <div className={"text-sm text-gray-500"}>
                        {item.description}
                      </div>
                    )
                  }
                </div>
                <div className={"flex items-center"}>
                  <button className={"h-8 text-[12px] px-2.5 border  border-gray-200 dark:border-gray-800 rounded-[10px] mr-2 inline-flex items-center space-x-1 font-medium w-[70px]"}>
                    <ArrowPathIcon width={16} height={16}/>
                    <div>
                      Use
                    </div>
                  </button>
                  {
                    searchParams.get("npcId") === item.id ? (
                      <button
                        onClick={() => {
                          router.replace(`/app/npc-lab`)
                        }}
                        className={"h-8 text-[12px] px-2.5 border  border-gray-200 dark:border-gray-800 rounded-[10px] mr-2 inline-flex items-center space-x-1 font-medium w-[70px]"}
                      >
                        <ArrowRightEndOnRectangleIcon width={16} height={16}/>
                        <div>
                          Hide
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          router.replace(`/app/npc-lab?npcId=${item.id}`)
                        }}
                        className={"h-8 text-[12px] px-2.5 border  border-gray-200 dark:border-gray-800 rounded-[10px] mr-2 inline-flex items-center space-x-1 font-medium w-[70px]"}
                      >
                        <ArrowLeftEndOnRectangleIcon width={16} height={16}/>
                        <div>
                          View
                        </div>
                      </button>
                    )
                  }

                </div>
              </div>
            ))
          }
        </div>
      </div>
      {
        searchParams.get("npcId") && (
          <div className={"max-w-screen-sm w-full border-l border-gray-200 dark:border-gray-800 flex flex-col"}>
            <div className={"flex h-20 border-b items-center px-5 justify-between"}>
              <div className={"flex items-center space-x-3"}>
                <div className={"text-xl font-semibold"}>
                  {npcData?.item?.agentName}
                </div>
                <div className={"text-gray-500 text-sm"}>
                  {npcData?.item?.agentStatus}
                </div>
              </div>
              <div>
                <button
                  disabled={status !== "idle"}
                  onClick={prepareNPC}
                  className={"h-8 text-[12px] px-2.5 border border-gray-200 dark:border-gray-800 rounded-[10px] mr-2 inline-flex items-center space-x-1 font-medium"}
                >
                  <ArrowPathIcon width={16} height={16}/>
                  <div>
                    { status === "loading" ? "loading..." : "Prepare"}
                  </div>
                </button>
              </div>
            </div>
            <div className={"flex-1"}>
            </div>
            <div className={"h-16 max-w-screen-sm w-full border-t border-gray-200 dark:border-gray-800 flex items-center px-3 justify-between"}>
              <div>
                <button
                  disabled={status !== "idle"}
                  onClick={deleteNPC}
                  className={"h-8 text-[12px] px-2.5 border  border-gray-200 dark:border-gray-800 rounded-[10px] mr-2 inline-flex items-center space-x-1 font-medium"}
                >
                  <TrashIcon width={16} height={16}/>
                  <div>
                    { status === "loading" ? "loading..." : "Delete"}
                  </div>
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(npcData?.item?.agentId || "").then(() => console.log("copy success"))
                  }}
                  className={"h-8 text-[12px] px-2.5 border  border-gray-200 dark:border-gray-800 rounded-[10px] mr-2 inline-flex items-center space-x-1 font-medium"}
                >
                  <DocumentDuplicateIcon width={16} height={16}/>
                  <div>
                    ID
                  </div>
                </button>
                <button
                  onClick={() => {
                  }}
                  className={"h-8 text-[12px] px-2.5 border  border-gray-200 dark:border-gray-800 rounded-[10px] mr-2 inline-flex items-center space-x-1 font-medium bg-foreground text-background"}
                >
                  <ArrowPathIcon width={16} height={16}/>
                  <div>
                    Chat with NPC
                  </div>
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Content;