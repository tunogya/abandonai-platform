import Link from "next/link";
import TheFooter from "@/components/TheFooter";
import { auth0 } from "@/lib/auth0";

const Page = async () => {
  const session = await auth0.getSession()

  return (
    <div className={"min-h-screen"}>
      <div className={"h-16 flex items-center px-5 justify-between max-w-screen-2xl ml-auto mr-auto"}>
        <svg width="160" height="16" viewBox="0 0 259 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M36.8811 24.624C37.2051 25.056 36.9531 25.344 36.5931 25.344H31.9491C31.5531 25.344 31.3731 25.128 31.1211 24.732L28.8171 21.168H8.18908L5.88508 24.732C5.63308 25.128 5.48908 25.344 5.05708 25.344H0.449079C0.0890793 25.344 -0.162921 25.056 0.125079 24.624L15.6051 0.720001C15.8211 0.360002 16.0011 0.144 16.3971 0.144H20.6451C21.0051 0.144 21.1851 0.360002 21.4011 0.720001L36.8811 24.624ZM10.9971 16.812H26.0091L18.7371 5.508H18.2691L10.9971 16.812Z"
            fill="currentColor"/>
          <path
            d="M69.0083 12.492C71.2403 13.356 72.2483 14.904 72.2483 17.1V18.504C72.2483 22.932 69.9083 25.344 64.7243 25.344H41.3243C40.9643 25.344 40.7843 25.164 40.7843 24.804V0.684C40.7843 0.324 40.9643 0.144 41.3243 0.144H64.5443C69.2243 0.144 71.3483 2.16 71.3483 6.588V7.236C71.3483 9.576 70.7003 11.196 69.0083 12.024V12.492ZM66.3803 7.128C66.3803 4.788 65.3723 4.608 63.8963 4.608H45.8603V10.476H63.8963C65.3723 10.476 66.3803 10.116 66.3803 7.884V7.128ZM67.2803 18.36V17.064C67.2803 15.12 66.3083 14.472 64.3643 14.472H45.8603V20.88H64.3643C66.3083 20.88 67.2803 20.34 67.2803 18.36Z"
            fill="currentColor"/>
          <path
            d="M111.834 24.624C112.158 25.056 111.906 25.344 111.546 25.344H106.902C106.506 25.344 106.326 25.128 106.074 24.732L103.77 21.168H83.1422L80.8382 24.732C80.5862 25.128 80.4422 25.344 80.0102 25.344H75.4022C75.0422 25.344 74.7902 25.056 75.0782 24.624L90.5582 0.720001C90.7742 0.360002 90.9542 0.144 91.3502 0.144H95.5982C95.9582 0.144 96.1382 0.360002 96.3542 0.720001L111.834 24.624ZM85.9502 16.812H100.962L93.6902 5.508H93.2222L85.9502 16.812Z"
            fill="currentColor"/>
          <path
            d="M116.277 25.344C115.917 25.344 115.737 25.164 115.737 24.804V0.684C115.737 0.324 115.917 0.144 116.277 0.144H121.065C121.389 0.144 121.533 0.288001 121.857 0.540002L141.873 19.404H142.305V0.684C142.305 0.324 142.521 0.144 142.881 0.144H146.841C147.201 0.144 147.381 0.324 147.381 0.684V24.804C147.381 25.164 147.201 25.344 146.841 25.344H142.053C141.729 25.344 141.585 25.2 141.261 24.948L121.245 6.084H120.813V24.804C120.813 25.164 120.597 25.344 120.237 25.344H116.277Z"
            fill="currentColor"/>
          <path
            d="M178.838 0.144C183.302 0.144 185.282 2.556 185.282 6.696V18.792C185.282 22.932 183.302 25.344 178.838 25.344H152.594C152.234 25.344 152.054 25.164 152.054 24.804V0.684C152.054 0.324 152.234 0.144 152.594 0.144H178.838ZM180.242 18.396V7.056C180.242 5.256 179.45 4.608 177.722 4.608H157.13V20.88H177.722C179.45 20.88 180.242 20.232 180.242 18.396Z"
            fill="currentColor"/>
          <path
            d="M196.256 25.488C191.792 25.488 189.596 23.076 189.596 18.936V6.552C189.596 2.412 191.792 0 196.256 0H215.372C219.836 0 222.068 2.412 222.068 6.552V18.936C222.068 23.076 219.836 25.488 215.372 25.488H196.256ZM197.408 21.024H214.256C215.948 21.024 216.992 20.376 216.992 18.54V6.948C216.992 5.112 215.948 4.464 214.256 4.464H197.408C195.716 4.464 194.672 5.112 194.672 6.948V18.54C194.672 20.376 195.716 21.024 197.408 21.024Z"
            fill="currentColor"/>
          <path
            d="M227.125 25.344C226.765 25.344 226.585 25.164 226.585 24.804V0.684C226.585 0.324 226.765 0.144 227.125 0.144H231.913C232.237 0.144 232.381 0.288001 232.705 0.540002L252.721 19.404H253.153V0.684C253.153 0.324 253.369 0.144 253.729 0.144H257.689C258.049 0.144 258.229 0.324 258.229 0.684V24.804C258.229 25.164 258.049 25.344 257.689 25.344H252.901C252.577 25.344 252.433 25.2 252.109 24.948L232.093 6.084H231.661V24.804C231.661 25.164 231.445 25.344 231.085 25.344H227.125Z"
            fill="currentColor"/>
        </svg>

        <div
          className={"text-[12px] font-bold flex"}
          style={{
            fontFamily: "Manifold Extended CF"
          }}
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
        {
          session ? (
            <div className={"flex gap-3"}>
              <Link
                href={"/app/home"}
                prefetch
                className={"bg-black text-white text-[12px] px-3 rounded-full h-6 font-bold flex items-center justify-center"}
              >
                GO TO APP
              </Link>
            </div>
            ) : (
            <div className={"flex gap-3"}>
              <a href="/auth/login" className={"text-sm bg-gray-200 px-3 h-6 rounded-full font-medium flex items-center justify-center"}>Log in</a>
              <Link
                href={"/app/home"}
                prefetch
                className={"bg-black text-white text-[12px] px-3 rounded-full h-6 font-bold flex items-center justify-center"}
              >
                GO TO APP
              </Link>
            </div>
          )
        }
      </div>
      <div className={"max-w-screen-2xl ml-auto mr-auto py-40 px-5 gap-4 flex flex-col"}>
        <div className={"text-5xl font-bold"}>
          Create your owned NPC powered by AI
        </div>
        <div className={"text-[18px]"}>
          Train your NPC once, let it generate income for you, and enjoy true freedom
        </div>
        <div>
          <button
            className={"h-10 px-4 uppercase bg-black text-white rounded-full font-bold text-[14px]"}
          >
            Get started free
          </button>
        </div>
      </div>

      <div className={"h-[300px]"}>
      </div>
      <TheFooter />
    </div>
  );
};

export default Page;