import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto, Playfair_Display, Montserrat, Lora, Open_Sans, Raleway, Comfortaa, Quicksand, Nunito, Poppins, Dancing_Script, Pacifico, Caveat, Kalam, Permanent_Marker } from "next/font/google"
import "./globals.css"
import { NotificationProvider } from "@/components/notifications/notification-context"
import { NotificationContainer } from "@/components/notifications/notification-container"
import { SubscriptionProvider } from "@/contexts/subscription-context"


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-roboto",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-opensans",
})

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
})

// Fredoka One is not available in next/font/google, using local font loading instead
// We'll handle this in CSS or use a fallback

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
})

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
})

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
})

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancingscript",
})

const pacifico = Pacifico({
  weight: ['400'],
  subsets: ["latin"],
  variable: "--font-pacifico",
})

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
})

const kalam = Kalam({
  weight: ['300', '400', '700'],
  subsets: ["latin"],
  variable: "--font-kalam",
})

const permanentMarker = Permanent_Marker({
  weight: ['400'],
  subsets: ["latin"],
  variable: "--font-permanentmarker",
})

export const metadata: Metadata = {
  title: "Lani Menu - Digital Restaurant Menus",
  description: "Create beautiful digital menus for your restaurant with QR codes",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} ${playfair.variable} ${montserrat.variable} ${lora.variable} ${openSans.variable} ${raleway.variable} ${comfortaa.variable} ${quicksand.variable} ${nunito.variable} ${poppins.variable} ${dancingScript.variable} ${pacifico.variable} ${caveat.variable} ${kalam.variable} ${permanentMarker.variable} antialiased`}>
      <body>
        <NotificationProvider>
          <SubscriptionProvider>
            {children}
            <NotificationContainer />
          </SubscriptionProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}
