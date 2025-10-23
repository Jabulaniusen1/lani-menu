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
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setSubscription(null)
        setLoading(false)
        return
      }

      // Get user's current subscription
      const { data, error } = await supabase
        .rpc('get_user_subscription', { user_uuid: user.id })

      if (error) {
        console.error('Error fetching subscription:', error)
        setSubscription(null)
      } else if (data && data.length > 0) {
        setSubscription(data[0])
      } else {
        // No active subscription, set to free plan
        setSubscription({
          id: 'free',
          plan_id: 'free',
          plan_name: 'Free',
          status: 'active',
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
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
