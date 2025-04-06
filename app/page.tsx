import { auth0 } from "@/app/_lib/auth0";
import Image from "next/image";
import Link from "next/link";

const Page = async () => {
  const session = await auth0.getSession();

  return (
    <div className={"min-w-screen min-h-screen flex flex-col"}>
      <div className={"flex-1 flex items-center justify-center"}>
        <Image
          width={360}
          height={360}
          alt={"banner"}
          src={"/50FB3804-536E-4012-BE9A-FA869F925AF8.png"} />
      </div>
      <div className={"h-[135px] px-4 flex justify-start items-center flex-col text-[13px] text-[#737373]"}>
        <div className={"flex gap-4 mt-4"}>
          <Link href={"/about.md"} target={"_blank"} className={"hover:underline"}>
            About
          </Link>
          <Link href={"https://x.com/abandonai"} target={"_blank"} className={"hover:underline"}>
            X.com
          </Link>
          <Link href={"/careers.md"} target={"_blank"} className={"hover:underline"}>
            Careers
          </Link>
          <Link href={"/help.md"} target={"_blank"} className={"hover:underline"}>
            Help
          </Link>
          <Link href={"/api.md"} target={"_blank"} className={"hover:underline"}>
            API
          </Link>
          <Link href={"/mcp.md"} target={"_blank"} className={"hover:underline"}>
            MCP
          </Link>
          <Link href={"/privacy-policy.md"} target={"_blank"} className={"hover:underline"}>
            Privacy Policy
          </Link>
          <Link href={"/safety.md"} target={"_blank"} className={"hover:underline"}>
            Safety
          </Link>
          <Link href={"/terms-of-use.md"} target={"_blank"} className={"hover:underline"}>
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