"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";

const TheMenuOfNPC = () => {
  const pathname = usePathname();
  const MENU = [
    {
      name: "My NPC",
      href: "/app/npc-lab",
    },
    {
      name: "Library",
      href: "/app/npc-library",
    },
    {
      name: "Collections",
      href: "/app/npc-library/collections",
    },
  ]

  return (
    <div className={"h-16 border-b flex items-center px-5 gap-5 border-gray-200 dark:border-gray-800"}>
      <div className={"text-[18px] font-bold"}>
        NPC
      </div>
      <div className={"flex items-center"}>
        {
          MENU.map((item, index) => {
            return (
              <Link key={index} href={item.href} className={`h-7 px-3 text-[14px] flex items-center font-medium rounded-full whitespace-nowrap ${pathname === item.href ? "bg-foreground text-background" : ""}`}>
                {item.name}
              </Link>
            )
          })
        }
      </div>
    </div>
  )
}

export default TheMenuOfNPC;