import {getTranslations} from "next-intl/server";

const Page = async () => {
  const t = await getTranslations("Notifications");

  return (
    <div className={"mx-auto p-8 relative min-h-screen w-full"}>
      <div className={"text-3xl font-bold"}>
        {t("Notifications")}
      </div>
    </div>
  )
}

export default Page;