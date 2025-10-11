"use client"

import { QrCode, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

interface DashboardHeaderProps {
  user: User
  restaurant: { name: string; slug: string } | null
}

export function DashboardHeader({ user, restaurant }: DashboardHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push("/sign-in")
    router.refresh()
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <QrCode className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{restaurant?.name || "QR Menu"}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
