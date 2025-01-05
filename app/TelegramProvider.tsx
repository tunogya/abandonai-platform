"use client";
import Script from "next/script";
import {createContext, useContext, useEffect, useMemo, useState} from "react";
import type {IWebAppUser, IWebApp} from "@/types";

export interface ITelegramContext {
  webApp?: IWebApp;
  user?: IWebAppUser;
}

export const TelegramContext = createContext<ITelegramContext>({});

declare global {
  interface Window {
    Telegram: {
      WebApp: IWebApp;
    };
  }
}

export const TelegramProvider = ({
                                   children,
                                 }: {
  children: React.ReactNode;
}) => {
  const [webApp, setWebApp] = useState<IWebApp | null>(null);

  // 首次初始化 webApp
  useEffect(() => {
    const app = window?.Telegram?.WebApp;
    if (app) {
      // A method that informs the Telegram app that the Mini App is ready to be displayed.
      // It is recommended to call this method as early as possible, as soon as all essential interface elements are
      // loaded. Once this method is called, the loading placeholder is hidden and the Mini App is shown.
      // If the method is not called, the placeholder will be hidden only when the page is fully loaded.
      app?.ready();
      if (app.colorScheme === "light") {
        app.setHeaderColor("#E0E0E0");
        app.setBackgroundColor("#E0E0E0")
      } else {
        app.setHeaderColor("#1D1D1D")
        app.setBackgroundColor("#1D1D1D")
      }
      setWebApp(app);
    }
  }, []);

  const value = useMemo(() => {
    return webApp
      ? {
        webApp,
        unsafeData: webApp.initDataUnsafe,
        user: webApp.initDataUnsafe.user,
      }
      : {};
  }, [webApp]);

  // onEvent, 当 fullscreenChanged 变化时，调用setWebApp
  useEffect(() => {
    const handler = () => {
      setWebApp(window?.Telegram?.WebApp);
    };
    window?.Telegram?.WebApp?.onEvent("fullscreenChanged", handler);
    return () => {
      window?.Telegram?.WebApp?.offEvent("fullscreenChanged", handler);
    };
  }, []);

  return (
    <TelegramContext.Provider value={value}>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      /> {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);