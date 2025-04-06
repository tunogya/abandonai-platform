import {auth0} from "@/app/_lib/auth0";
import Image from "next/image";
import Link from "next/link";

const Page = async () => {
  const session = await auth0.getSession();

  return (
    <div className={"min-w-screen min-h-screen flex flex-col"}>
      <div className={"flex-1 flex items-center justify-center py-20 gap-20 flex-col md:flex-row"}>
        <Image
          width={360}
          height={360}
          alt={"banner"}
          src={"/50FB3804-536E-4012-BE9A-FA869F925AF8.png"}/>
        <div className={"w-[360px] flex flex-col gap-4 justify-center items-center"}>
          <div className={"mb-20"}>
            <Image width={200} height={200} alt={"logo"} src={"/logo.svg"} className={"bg-black"}/>
          </div>
          {
            session ? (
              <>
                <div className={"flex gap-4 items-center"}>
                  <div>
                    Hello, {session.user.email}
                  </div>
                  <a
                    href={"/auth/logout"}
                    className={"cursor-pointer text-xs font-medium px-2 py-0.5 text-[#737373] border border-[#737373] rounded-full hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"}
                  >
                    Log out
                  </a>
                </div>
                <Link
                  href={"/home"}
                  className={"border border-black px-4 h-12 hover:bg-black hover:text-white transition-all w-full font-bold flex items-center justify-center"}
                >
                  Let&#39;s create a blind box!
                </Link>
                <div className={"text-xs text-[#737373]"}>$$$ Earn money while you sleep $$$</div>
              </>
            ) : (
              <>
                <a
                  href={"/auth/login?returnTo=/home&audience=https://abandon.ai/api"}
                  className={"border border-black px-4 h-12 hover:bg-black hover:text-white transition-all w-full font-bold flex items-center justify-center"}
                >
                  Start ABANDON
                </a>
                <div className={"text-xs text-[#737373]"}>Sign up and see where your creativity takes you!</div>
              </>
            )
          }
        </div>
      </div>
      <div className={"h-[135px] px-4 flex justify-start items-center flex-col text-[13px] text-[#737373]"}>
        <div className={"flex gap-4 mt-4 w-screen overflow-scroll px-4 md:w-fit"}>
          <Link href={"/about.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            About
          </Link>
          <Link href={"https://x.com/abandonai"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            X.com
          </Link>
          <Link href={"/careers.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            Careers
          </Link>
          <Link href={"/help.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            Help
          </Link>
          <Link href={"/api.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            API
          </Link>
          <Link href={"/mcp.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            MCP
          </Link>
          <Link href={"/privacy-policy.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            Privacy Policy
          </Link>
          <Link href={"/safety.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            Safety
          </Link>
          <Link href={"/terms-of-use.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            Terms of Use
          </Link>
        </div>
        <div className={"py-3"}>
          Copyright © {new Date().getFullYear()} Abandon Inc. All rights reserved.
        </div>
      </div>

    </div>
  );
};

export default Page;