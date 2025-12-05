"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { MultiRestaurantDashboard } from "./multi-restaurant-dashboard"
import { useNotification } from "@/hooks/use-notification"
import { useSubscription } from "@/contexts/subscription-context"
import { Loader2 } from "lucide-react"

interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
  }
  app_metadata?: any
  aud?: string
  created_at?: string
}

interface Restaurant {
  id: string
  name: string
  slug: string
  description: string | null
  phone: string | null
  address: string | null
  website: string | null
  currency: string
  logo_url: string | null
  created_at: string
  updated_at: string
  is_primary: boolean
  user_id: string
}

interface DashboardClientProps {
  initialUser: User
  initialRestaurants: Restaurant[]
}

export function DashboardClient({ initialUser, initialRestaurants }: DashboardClientProps) {
  const { notify } = useNotification()
  const { refreshSubscription } = useSubscription()
  const router = useRouter()
  const [user, setUser] = useState<User>(initialUser)
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants)
  const [loading, setLoading] = useState(false)

  // Handle payment success callback - runs on dashboard load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const paymentSuccess = urlParams.get('payment') === 'success'
    const reference = urlParams.get('reference')
    
    if (paymentSuccess && reference) {
      // Verify payment with Paystack
      const verifyPayment = async () => {
        try {
          console.log('Dashboard: Verifying payment with reference:', reference)
          const response = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reference }),
          })

          const data = await response.json()

          if (response.ok && data.success) {
            console.log('Dashboard: Payment verified successfully', data)
            notify.success('Payment Successful!', 'Your subscription has been activated.')
            
            // Refresh subscription immediately and with retries
            refreshSubscription()
            
            setTimeout(() => {
              refreshSubscription()
            }, 1000)
            
            setTimeout(() => {
              refreshSubscription()
            }, 3000)
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname)
          } else {
            console.error('Dashboard: Payment verification failed:', data.error)
            notify.error('Payment Verification Failed', data.error || 'Could not verify payment')
          }
        } catch (error) {
          console.error('Dashboard: Error verifying payment:', error)
          notify.error('Payment Verification Error', error instanceof Error ? error.message : 'Unknown error')
        }
      }

      verifyPayment()
    } else if (paymentSuccess) {
      // If payment=success but no reference, just refresh (webhook might have handled it)
      console.log('Dashboard: Payment success detected, refreshing subscription')
      refreshSubscription()
      
      setTimeout(() => {
        refreshSubscription()
      }, 1000)
      
      setTimeout(() => {
        refreshSubscription()
      }, 3000)
      
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [refreshSubscription, notify])

  // Fetch restaurants from database
  const fetchRestaurants = async () => {
    setLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      
      const { data, error } = await supabase
        .rpc('get_user_restaurants', { user_uuid: user.id })

      if (error) throw error

      console.log('Fetched restaurants:', data)
      setRestaurants(data || [])
      return data || []
    } catch (error) {
      console.error('Error fetching restaurants:', error)
      notify.error("Failed to load restaurants", error instanceof Error ? error.message : "Unknown error")
      return []
    } finally {
      setLoading(false)
    }
  }

  // Refresh restaurants when needed
  const handleRestaurantsUpdate = (updatedRestaurants: Restaurant[]) => {
    console.log('Restaurants updated in DashboardClient:', updatedRestaurants)
    console.log('Previous restaurants count:', restaurants.length)
    console.log('New restaurants count:', updatedRestaurants.length)
    setRestaurants(updatedRestaurants)
    
    // If we went from 0 to 1+ restaurants, we should now show the dashboard
    if (restaurants.length === 0 && updatedRestaurants.length > 0) {
      console.log('First restaurant created, should show dashboard now')
    }
  }

  // Handle restaurant change with page reload
  const handleRestaurantChange = (restaurant: Restaurant) => {
    console.log('Restaurant changed, reloading page:', restaurant)
    // Reload the page to refresh all data
    router.refresh()
  }

  // Get primary restaurant for header (or first restaurant)
  const primaryRestaurant = restaurants.find(r => r.is_primary) || restaurants[0] || null

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading restaurants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MultiRestaurantDashboard 
        initialRestaurants={restaurants} 
        userId={user.id}
        onRestaurantsUpdate={handleRestaurantsUpdate}
        onRestaurantChange={handleRestaurantChange}
      />
    </div>
  )
}