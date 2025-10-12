import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Check if user has restaurants using the new function
  const { data: restaurants, error: restaurantsError } = await supabase
    .rpc('get_user_restaurants', { user_uuid: user.id })
  
  if (restaurantsError) {
    console.error('Error fetching restaurants:', restaurantsError)
  }
  
  console.log('Restaurants data from database:', restaurants)

  // Get primary restaurant for header (or first restaurant)
  const primaryRestaurant = restaurants?.find((r: any) => r.is_primary) || restaurants?.[0] || null

  return (
    <DashboardClient 
      initialUser={user} 
      initialRestaurants={restaurants || []} 
    />
  )
}
