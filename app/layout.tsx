import type { Metadata } from "next"
import { Inter, Noto_Sans_KR } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { cn } from "@/lib/utils"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
})

export const metadata: Metadata = {
  title: "A11yGym - 웹 접근성 실습 플랫폼",
  description: "개발자를 위한 실전 웹 접근성 교육 및 실습 플랫폼",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        notoSansKr.variable
      )}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}