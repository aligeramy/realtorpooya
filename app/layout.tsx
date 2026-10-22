import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Montserrat, Manrope, Inter, Playfair_Display, Tenor_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/next"

// Self-hosted through next/font: no render-blocking Google Fonts stylesheet.
const tenorSans = Tenor_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-tenor-sans",
  display: "swap",
})

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
      <body
        className={`${montserrat.variable} ${manrope.variable} ${playfairDisplay.variable} ${tenorSans.variable} ${inter.className} font-manrope tracking-tight`}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          forcedTheme="light"
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
