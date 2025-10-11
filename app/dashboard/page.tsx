import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { RestaurantSetup } from "@/components/dashboard/restaurant-setup"
import { MenuManager } from "@/components/dashboard/menu-manager"

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Check if user has a restaurant
  const { data: restaurant } = await supabase.from("restaurants").select("*").eq("user_id", user.id).single()

  return (
    <div className="min-h-screen bg-secondary/30">
      <DashboardHeader user={user} restaurant={restaurant} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {!restaurant ? <RestaurantSetup userId={user.id} /> : <MenuManager restaurant={restaurant} />}
      </main>
    </div>
  )
}
