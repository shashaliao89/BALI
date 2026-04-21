import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";

const notoSerifTc = Noto_Serif_TC({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSansTc = Noto_Sans_TC({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "STEPC 峇里島身心靈療癒之旅 - 重新連結您的靈魂",
  description:
    "STEPC Bali Soulventure — 極簡奢華的身心靈旅程。薩滿呼吸、冥想、冰浴與神聖儀式，在峇里島重新連結你的靈魂。",
  keywords: [
    "STEPC",
    "峇里島",
    "身心靈",
    "療癒之旅",
    "Soulventure",
    "Bali",
    "冥想",
    "薩滿呼吸",
  ],
  openGraph: {
    title: "STEPC 峇里島身心靈療癒之旅 - 重新連結您的靈魂",
    description:
      "Awaken your soul. 在峇里島的棲所與儀式中，展開一場為靈魂而設的旅程。",
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STEPC 峇里島身心靈療癒之旅 - 重新連結您的靈魂",
    description:
      "Awaken your soul — STEPC Bali Soulventure 身心靈療癒旅程。",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${notoSerifTc.variable} ${notoSansTc.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-[#F5F5F0] font-sans text-[#3d3428]">
        {children}
      </body>
    </html>
  );
}
