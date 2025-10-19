import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AddRestaurantClient } from "@/components/dashboard/add-restaurant-client"

export default async function AddRestaurantPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Check if user already has restaurants
  const { data: restaurants, error: restaurantsError } = await supabase
    .rpc('get_user_restaurants', { user_uuid: user.id })
  
  if (restaurantsError) {
    console.error('Error fetching restaurants:', restaurantsError)
  }
  
  console.log('Add-restaurant page - User ID:', user.id)
  console.log('Add-restaurant page - Restaurants data from database:', restaurants)
  console.log('Add-restaurant page - Restaurants count:', restaurants?.length || 0)
  
  // If user already has restaurants, redirect to dashboard
  if (restaurants && restaurants.length > 0) {
    console.log('Add-restaurant page - User has restaurants, redirecting to dashboard')
    redirect("/dashboard")
  }

  return <AddRestaurantClient userId={user.id} />
}
