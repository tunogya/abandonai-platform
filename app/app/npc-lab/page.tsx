import Content from "@/app/app/npc-lab/Content";
import TheMenuOfNPC from "@/components/TheMenuOfNPC";

const Page = () => {
  return (
    <div className={"relative flex flex-col min-h-screen h-full"}>
      <TheMenuOfNPC />
      <Content />
    </div>
  )
}

export default Page;