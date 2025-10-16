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
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="bg-primary p-1.5 sm:p-2 rounded-lg flex-shrink-0">
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold truncate">{restaurant?.name || "Lani Menu"}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSignOut}
            className="flex-shrink-0 ml-2"
          >
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
