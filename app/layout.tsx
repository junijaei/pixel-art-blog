import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Silkscreen } from "next/font/google"
import "./globals.css"
import { FileExplorer } from "@/components/file-explorer"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-silkscreen",
})

export const metadata: Metadata = {
  title: "Pixel Blog",
  description: "A minimal pixel-styled blog exploring design, minimalism, and creativity",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#fafafa",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${silkscreen.variable} font-sans antialiased`}>
        <div className="flex">
          <FileExplorer />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  )
}
