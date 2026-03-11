import type { Metadata } from "next";
import { Instrument_Serif, Space_Grotesk } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Pokopia Index · 포코피아 데이터 허브",
  description:
    "포코피아 포켓몬 도감, 아이템 도감, 건축/제작 정보를 빠르게 찾는 OP.GG 스타일 정보 사이트.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${space.variable} ${serif.variable}`}>
      <body className="font-sans">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
