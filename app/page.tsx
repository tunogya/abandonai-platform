import {auth0} from "@/app/_lib/auth0";
import Image from "next/image";
import Link from "next/link";
import {getTranslations} from "next-intl/server";

const Page = async () => {
  const session = await auth0.getSession();
  const t = await getTranslations('Root');

  return (
    <div className={"min-w-screen min-h-screen flex flex-col"}>
      <div className={"flex-1 flex items-center justify-center py-20 gap-20 flex-col md:flex-row"}>
        <div>
          <Image
            width={360}
            height={360}
            alt={"banner"}
            src={"/50FB3804-536E-4012-BE9A-FA869F925AF8.png"}/>
        </div>
        <div className={"w-[360px] flex flex-col gap-4 justify-center items-center p-4"}>
          <div className={"mb-20"}>
            <Image width={200} height={50} alt={"logo"} src={"/logo.svg"}/>
          </div>
          {
            session ? (
              <>
                <div className={"flex gap-4 items-center"}>
                  <div>
                    {t("Hello")}, {session.user.email}
                  </div>
                  <a
                    href={"/auth/logout"}
                    className={"cursor-pointer text-xs font-bold text-red-500 transition-all underline underline-offset-4 hover:bg-red-500 hover:text-white"}
                  >
                    {t("Log out")}
                  </a>
                </div>
                <Link
                  href={"/home"}
                  className={"border border-black px-4 h-12 hover:bg-black hover:text-white transition-all w-full font-bold flex items-center justify-center rounded-full"}
                >
                  {t("Let's create a blind box!")}
                </Link>
                <div className={"text-xs text-[#737373]"}>{t("$$$ Earn money while you sleep $$$")}</div>
              </>
            ) : (
              <>
                <a
                  href={"/auth/login?returnTo=/home&audience=https://abandon.ai/api"}
                  className={"border border-black px-4 h-12 hover:bg-black hover:text-white transition-all w-full font-bold flex items-center justify-center"}
                >
                  {t("Start ABANDON")}
                </a>
                <div className={"text-xs text-[#737373]"}>{t("Sign up and see where your creativity takes you!")}</div>
              </>
            )
          }
        </div>
      </div>
      <div className={"h-[135px] px-4 flex justify-start items-center flex-col text-[13px] text-[#737373]"}>
        <div className={"flex gap-4 mt-4 w-screen overflow-scroll px-4 md:w-fit"}>
          <Link href={"/about.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            {t("About")}
          </Link>
          <Link href={"https://x.com/abandonai"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            X.com
          </Link>
          <Link href={"/careers.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            {t("Careers")}
          </Link>
          <Link href={"/help.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            {t("Help")}
          </Link>
          <Link href={"/api.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            {t("API")}
          </Link>
          <Link href={"/mcp.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            {t("MCP")}
          </Link>
          <Link href={"/privacy-policy.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            {t("Privacy Policy")}
          </Link>
          <Link href={"/safety.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            {t("Safety")}
          </Link>
          <Link href={"/terms-of-use.md"} target={"_blank"} className={"hover:underline whitespace-nowrap"}>
            {t("Terms of Use")}
          </Link>
        </div>
        <div className={"py-3"}>
          {t("Copyright")} © {new Date().getFullYear()} Abandon Inc. {t("All rights reserved")}
        </div>
      </div>

    </div>
  );
};

export default Page;