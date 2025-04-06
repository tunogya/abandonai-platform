import {auth0} from "@/app/_lib/auth0";
import {QuestionMarkCircleIcon} from "@heroicons/react/16/solid";
import {CheckBadgeIcon} from "@heroicons/react/24/outline";
import {unauthorized} from "next/navigation";

const Page = async () => {
  const session = await auth0.getSession()

  if (!session) {
    unauthorized();
  }

  return (
    <div className={"max-w-screen-lg mx-auto py-20 flex flex-col gap-8"}>
      <div className={"flex flex-col gap-1"}>
        <div className={"text-gray-500 text-xs flex items-center gap-1"}>
          {session.user?.email}
          {
            session.user.email_verified ? (
              <CheckBadgeIcon className={"w-4 h-4"}/>
            ) : (
              <QuestionMarkCircleIcon className={"w-4 h-4"} />
            )
          }
        </div>
        <div className={"text-2xl font-bold"}>
          Good Morning
        </div>
      </div>
      <div className={"flex"}>
        <div className={"w-full flex flex-col gap-3"}>
          <div className={"text-lg font-medium"}>
            Latest from the library
          </div>
        </div>
        <div className={"w-full flex flex-col gap-3"}>
          <div className={"text-lg font-medium"}>
            Create or clone a NPC
          </div>
          <div>
            <div className={"min-h-[92px] h-[92px] flex items-center gap-3"}>
              <div className={"w-[120px] h-[80px] bg-gray-100 rounded-[10px] flex items-center justify-center"}>

              </div>
              <div className={"flex flex-col justify-center h-full"}>
                <div className={"text-sm font-medium"}>
                  NPC Design
                </div>
                <div className={"text-sm text-gray-500"}>
                  Design an entirely new voice from a text prompt
                </div>
              </div>
            </div>

            <div className={"min-h-[92px] h-[92px] flex items-center gap-3"}>
              <div className={"w-[120px] h-[80px] bg-gray-100 rounded-[10px] flex items-center justify-center"}>

              </div>
              <div className={"flex flex-col justify-center h-full"}>
                <div className={"text-sm font-medium"}>
                  Clone your NPC
                </div>
                <div className={"text-sm text-gray-500"}>
                  Create a clone of your NPC
                </div>
              </div>
            </div>

            <div className={"min-h-[92px] h-[92px] flex items-center gap-3"}>
              <div className={"w-[120px] h-[80px] bg-gray-100 rounded-[10px] flex items-center justify-center"}>

              </div>
              <div className={"flex flex-col justify-center h-full"}>
                <div className={"text-sm font-medium"}>
                  NPC Collections
                </div>
                <div className={"text-sm text-gray-500"}>
                  Curated NPC for every use case
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page;