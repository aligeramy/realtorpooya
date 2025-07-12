import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Montserrat, Manrope, Inter, Playfair_Display } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/next"

// Import Tenor Sans (not available directly in next/font/google)
const tenorSans = {
  variable: "--font-tenor-sans",
  style: "normal",
  weight: "400",
}

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
      title: "Pooya Pirayeshakbari Luxury Real Estate",
  description: "Find your dream home in Toronto and the GTA",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tenor+Sans&display=swap" />
      </head>
      <body
        className={`${montserrat.variable} ${manrope.variable} ${playfairDisplay.variable} ${inter.className} font-manrope tracking-tight`}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false} 
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
