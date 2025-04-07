import type {Metadata, Viewport} from "next";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'
import {ReactNode} from "react";
import BreakpointIndicator from "@/app/_components/BreakpointIndicator";

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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
    <body
      className={`antialiased`}
    >
    {children}
    <BreakpointIndicator />
    </body>
    </html>
  );
}
