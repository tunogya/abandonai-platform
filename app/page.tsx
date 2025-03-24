import TheFooter from "@/components/TheFooter";
import { auth0 } from "@/lib/auth0";

const Page = async () => {
  const session = await auth0.getSession()

  return (
    <div className={"min-h-screen"}>
      <div className={"h-16 flex items-center px-5 justify-between max-w-screen-2xl ml-auto mr-auto"}>
        <svg width="160" height="16" viewBox="0 0 259 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M196.256 25.488C191.792 25.488 189.596 23.076 189.596 18.936V6.552C189.596 2.412 191.792 0 196.256 0H215.372C219.836 0 222.068 2.412 222.068 6.552V18.936C222.068 23.076 219.836 25.488 215.372 25.488H196.256ZM36.8811 24.624C37.2051 25.056 36.9531 25.344 36.5931 25.344H31.9491C31.5531 25.344 31.3731 25.128 31.1211 24.732L28.8171 21.168H8.18908L5.88508 24.732C5.63308 25.128 5.48908 25.344 5.05708 25.344H0.449082C0.0890825 25.344 -0.162918 25.056 0.125082 24.624L15.6051 0.720001C15.8211 0.360002 16.0011 0.144 16.3971 0.144H20.6451C21.0051 0.144 21.1851 0.360002 21.4011 0.720001L36.8811 24.624ZM10.9971 16.812H26.0091L18.7371 5.508H18.2691L10.9971 16.812ZM69.0083 12.492C71.2403 13.356 72.2483 14.904 72.2483 17.1V18.504C72.2483 22.932 69.9083 25.344 64.7243 25.344H41.3243C40.9643 25.344 40.7843 25.164 40.7843 24.804V0.684C40.7843 0.324 40.9643 0.144 41.3243 0.144H64.5443C69.2243 0.144 71.3483 2.16 71.3483 6.588V7.236C71.3483 9.576 70.7003 11.196 69.0083 12.024V12.492ZM66.3803 7.128C66.3803 4.788 65.3723 4.608 63.8963 4.608H45.8603V10.476H63.8963C65.3723 10.476 66.3803 10.116 66.3803 7.884V7.128ZM67.2803 18.36V17.064C67.2803 15.12 66.3083 14.472 64.3643 14.472H45.8603V20.88H64.3643C66.3083 20.88 67.2803 20.34 67.2803 18.36ZM111.546 25.344C111.906 25.344 112.158 25.056 111.834 24.624L96.3542 0.720001C96.1382 0.360002 95.9582 0.144 95.5982 0.144H91.3502C90.9542 0.144 90.7742 0.360002 90.5582 0.720001L75.0782 24.624C74.7902 25.056 75.0422 25.344 75.4022 25.344H80.0102C80.4422 25.344 80.5862 25.128 80.8382 24.732L83.1422 21.168H103.77L106.074 24.732C106.326 25.128 106.506 25.344 106.902 25.344H111.546ZM100.962 16.812H85.9502L93.2222 5.508H93.6902L100.962 16.812ZM116.277 25.344C115.917 25.344 115.737 25.164 115.737 24.804V0.684C115.737 0.324 115.917 0.144 116.277 0.144H121.065C121.355 0.144 121.501 0.259005 121.76 0.463321L121.76 0.46335L121.76 0.463373C121.791 0.487668 121.823 0.513225 121.857 0.540002L141.873 19.404H142.305V0.684C142.305 0.324 142.521 0.144 142.881 0.144H146.841C147.201 0.144 147.381 0.324 147.381 0.684V24.804C147.381 25.164 147.201 25.344 146.841 25.344H142.053C141.764 25.344 141.618 25.229 141.359 25.0247L141.359 25.0246L141.307 24.984L141.261 24.948L121.245 6.084H120.813V24.804C120.813 25.164 120.597 25.344 120.237 25.344H116.277ZM185.282 6.696C185.282 2.556 183.302 0.144 178.838 0.144H152.594C152.234 0.144 152.054 0.324 152.054 0.684V24.804C152.054 25.164 152.234 25.344 152.594 25.344H178.838C183.302 25.344 185.282 22.932 185.282 18.792V6.696ZM180.242 7.056V18.396C180.242 20.232 179.45 20.88 177.722 20.88H157.13V4.608H177.722C179.45 4.608 180.242 5.256 180.242 7.056ZM226.585 24.804C226.585 25.164 226.765 25.344 227.125 25.344H231.085C231.445 25.344 231.661 25.164 231.661 24.804V6.084H232.093L252.109 24.948C252.143 24.9748 252.176 25.0004 252.207 25.0247C252.466 25.229 252.611 25.344 252.901 25.344H257.689C258.049 25.344 258.229 25.164 258.229 24.804V0.684C258.229 0.324 258.049 0.144 257.689 0.144H253.729C253.369 0.144 253.153 0.324 253.153 0.684V19.404H252.721L232.705 0.540002C232.671 0.513211 232.638 0.487641 232.607 0.463334C232.348 0.25901 232.203 0.144 231.913 0.144H227.125C226.765 0.144 226.585 0.324 226.585 0.684V24.804ZM206 21C210.418 21 214 17.4183 214 13C214 8.58172 210.418 5 206 5C201.582 5 198 8.58172 198 13C198 17.4183 201.582 21 206 21Z" fill="black"/>
        </svg>
        <div
          className={"text-[12px] font-bold flex"}
        >
          <div className={"px-[10px] uppercase"}>
            NPC
          </div>
          <div className={"px-[10px] uppercase"}>
            Solutions
          </div>
          <div className={"px-[10px] uppercase"}>
            Docs
          </div>
          <div className={"px-[10px] uppercase"}>
            Pricing
          </div>
          <div className={"px-[10px] uppercase"}>
            Company
          </div>
        </div>
        <div className={"flex gap-3"}>
          {/*You must use <a> tags instead of the <Link> component to ensure that the routing is not done client-side as that may result in some unexpected behavior.*/}
          {
            !session && (
              <a href={"/auth/login?returnTo=/app/home&audience=https://abandon.ai/api"} className={"text-sm bg-gray-200 px-3 h-6 rounded-full font-medium flex items-center justify-center"}>Log in</a>
            )
          }
          {/*You must use <a> tags instead of the <Link> component to ensure that the routing is not done client-side as that may result in some unexpected behavior.*/}
          <a
            href={"/auth/login?returnTo=/app/home&audience=https://abandon.ai/api"}
            className={"bg-foreground text-background text-[12px] px-3 rounded-full h-6 font-bold flex items-center justify-center whitespace-nowrap"}
          >
            GO TO APP
          </a>
        </div>
      </div>
      <div className={"max-w-screen-2xl ml-auto mr-auto py-40 px-5 gap-4 flex flex-col"}>
        <div className={"text-5xl font-bold"}>
          Create your owned NPC powered by AI
        </div>
        <div className={"text-[18px]"}>
          Train your NPC once, let it generate income for you, and enjoy true freedom
        </div>
        <div className={"flex"}>
          {/*You must use <a> tags instead of the <Link> component to ensure that the routing is not done client-side as that may result in some unexpected behavior.*/}
          <a
            href={"/auth/login?screen_hint=signup&returnTo=/app/home&audience=https://abandon.ai/api"}
            className={"cursor-pointer"}
          >
            <div className={"h-10 px-4 uppercase bg-foreground text-background flex items-center justify-center rounded-full font-bold text-[14px] whitespace-nowrap"}>
              Get started free
            </div>
          </a>
        </div>
      </div>
      <div className={"h-[300px]"}>
      </div>
      <TheFooter />
    </div>
  );
};

export default Page;