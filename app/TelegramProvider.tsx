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

  useEffect(() => {
    const app = window?.Telegram?.WebApp;
    if (app) {
      // A method that informs the Telegram app that the Mini App is ready to be displayed.
      // It is recommended to call this method as early as possible, as soon as all essential interface elements are
      // loaded. Once this method is called, the loading placeholder is hidden and the Mini App is shown.
      // If the method is not called, the placeholder will be hidden only when the page is fully loaded.
      app?.ready();
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