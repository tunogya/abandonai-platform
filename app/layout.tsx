import type {Metadata, Viewport} from "next";
import "./globals.css";
import {GoogleAnalytics} from '@next/third-parties/google'
import {ReactNode} from "react";
import BreakpointIndicator from "@/app/_components/BreakpointIndicator";
import {getLocale} from 'next-intl/server';
import {NextIntlClientProvider} from 'next-intl';

export const metadata: Metadata = {
  title: "ABANDON",
  description: "",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  viewportFit: "cover",
  userScalable: false,
};

export default async function RootLayout({children}: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""}/>
    <body
      className={`antialiased`}
    >
    <NextIntlClientProvider>{children}</NextIntlClientProvider>
    {
      process.env.NODE_ENV === "development" && (
        <BreakpointIndicator/>
      )
    }
    </body>
    </html>
  );
}
