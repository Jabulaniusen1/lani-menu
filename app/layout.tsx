import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NotificationProvider } from "@/components/notifications/notification-context"
import { NotificationContainer } from "@/components/notifications/notification-container"
import { SubscriptionProvider } from "@/contexts/subscription-context"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "QR Menu - Digital Restaurant Menus",
  description: "Create beautiful digital menus for your restaurant with QR codes",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
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
