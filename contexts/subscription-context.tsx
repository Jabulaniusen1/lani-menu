"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

interface Subscription {
  id: string
  plan_id: string
  plan_name: string
  status: 'active' | 'cancelled' | 'expired' | 'past_due'
  current_period_end: string
  features: string[]
  limitations: string[]
}

interface SubscriptionContextType {
  subscription: Subscription | null
  loading: boolean
  refreshSubscription: () => Promise<void>
  canAddMenuItem: (restaurantId: string) => Promise<boolean>
  canAddRestaurant: () => Promise<boolean>
  getPlanLimits: () => { menuItems: number; restaurants: number }
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshSubscription = async () => {
    try {
      setLoading(true)
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setSubscription(null)
        setLoading(false)
        return
      }

      // Get user's current subscription using RPC function
      const { data, error } = await supabase
        .rpc('get_user_subscription', { user_uuid: user.id })

      if (error) {
        console.error('Error fetching subscription via RPC:', error)
        
        // Fallback: Try direct query if RPC fails
        console.log('Attempting direct subscription query as fallback...')
        const { data: directData, error: directError } = await supabase
          .from('user_subscriptions')
          .select(`
            id,
            plan_id,
            status,
            current_period_end,
            subscription_plans (
              name,
              features,
              limitations
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (directError || !directData) {
          console.log('No active subscription found, setting to free plan')
          setSubscription({
            id: 'free',
            plan_id: 'free',
            plan_name: 'Free',
            status: 'active',
            current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            features: [
              'Up to 5 menu items',
              '1 restaurant location',
              'Basic QR code generation',
              'Standard menu design',
              'Email support'
            ],
            limitations: [
              'No custom branding',
              'No analytics',
              'No menu design customization'
            ]
          })
        } else {
          console.log('Subscription found via direct query:', directData)
          const plan = directData.subscription_plans
          setSubscription({
            id: directData.id,
            plan_id: directData.plan_id,
            plan_name: plan?.name || directData.plan_id,
            status: directData.status,
            current_period_end: directData.current_period_end,
            features: plan?.features || [],
            limitations: plan?.limitations || []
          })
        }
      } else if (data && data.length > 0) {
        console.log('Subscription refreshed via RPC:', data[0])
        setSubscription(data[0])
      } else {
        // No active subscription, set to free plan
        console.log('No subscription found via RPC, setting to free plan')
        setSubscription({
          id: 'free',
          plan_id: 'free',
          plan_name: 'Free',
          status: 'active',
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          features: [
            'Up to 5 menu items',
            '1 restaurant location',
            'Basic QR code generation',
            'Standard menu design',
            'Email support'
          ],
          limitations: [
            'No custom branding',
            'No analytics',
            'No menu design customization'
          ]
        })
      }
    } catch (error) {
      console.error('Error refreshing subscription:', error)
      setSubscription(null)
    } finally {
      setLoading(false)
    }
  }

  const canAddMenuItem = async (restaurantId: string): Promise<boolean> => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return false

      const { data, error } = await supabase
        .rpc('can_add_menu_item', { 
          user_uuid: user.id, 
          restaurant_uuid: restaurantId 
        })

      if (error) {
        console.error('Error checking menu item limit:', error)
        return false
      }

      return data || false
    } catch (error) {
      console.error('Error checking menu item limit:', error)
      return false
    }
  }

  const canAddRestaurant = async (): Promise<boolean> => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return false

      const { data, error } = await supabase
        .rpc('can_add_restaurant', { user_uuid: user.id })

      if (error) {
        console.error('Error checking restaurant limit:', error)
        return false
      }

      return data || false
    } catch (error) {
      console.error('Error checking restaurant limit:', error)
      return false
    }
  }

  const getPlanLimits = () => {
    if (!subscription) {
      return { menuItems: 5, restaurants: 999999 }
    }

    switch (subscription.plan_id) {
      case 'free':
        return { menuItems: 5, restaurants: 999999 }
      case 'pro':
        return { menuItems: 999999, restaurants: 999999 }
      case 'business':
        return { menuItems: 999999, restaurants: 999999 }
      default:
        return { menuItems: 5, restaurants: 999999 }
    }
  }

  useEffect(() => {
    refreshSubscription()
    
    // Refresh subscription when page becomes visible (user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshSubscription()
      }
    }
    
    // Refresh subscription on focus (user switches back to window)
    const handleFocus = () => {
      refreshSubscription()
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    
    // Also refresh periodically (every 30 seconds) to catch webhook updates
    const interval = setInterval(() => {
      refreshSubscription()
    }, 30000)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [])

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        refreshSubscription,
        canAddMenuItem,
        canAddRestaurant,
        getPlanLimits
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}
