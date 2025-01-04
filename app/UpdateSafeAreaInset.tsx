"use client";
import {useEffect} from "react";
import {useTelegram} from "@/app/TelegramProvider";

const Page = () => {
  const { webApp } = useTelegram();

  useEffect(() => {
    if (webApp) {
      const { safeAreaInset, contentSafeAreaInset } = webApp || {};

      if (safeAreaInset !== undefined && contentSafeAreaInset !== undefined) {
        document.documentElement.style.setProperty("--tg-content-safe-area-inset-top", `${contentSafeAreaInset.top}px`);
        document.documentElement.style.setProperty("--tg-content-safe-area-inset-bottom", `${contentSafeAreaInset.bottom}px`);
        document.documentElement.style.setProperty("--tg-content-safe-area-inset-left", `${contentSafeAreaInset.left}px`);
        document.documentElement.style.setProperty("--tg-content-safe-area-inset-right", `${contentSafeAreaInset.right}px`);

        document.documentElement.style.setProperty("--tg-safe-area-inset-top", `${safeAreaInset.top}px`);
        document.documentElement.style.setProperty("--tg-safe-area-inset-bottom", `${safeAreaInset.bottom}px`);
        document.documentElement.style.setProperty("--tg-safe-area-inset-left", `${safeAreaInset.left}px`);
        document.documentElement.style.setProperty("--tg-safe-area-inset-right", `${safeAreaInset.right}px`);
      }
    }
  }, []);

  return null;
}

export default Page;