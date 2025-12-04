"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Crown, Check, Star, Zap, Users, QrCode, Palette, Loader2 } from "lucide-react"
import { PaymentButton } from "@/components/payments/payment-button"
import { useSubscription } from "@/contexts/subscription-context"
import { useEffect, useState } from "react"

interface BillingTabProps {
  currentPlan?: string
}

export function BillingTab({ currentPlan = "free" }: BillingTabProps) {
  const { subscription, loading, refreshSubscription } = useSubscription()
  const [plans, setPlans] = useState<any[]>([])

  useEffect(() => {
    // Fetch plans from database
    const fetchPlans = async () => {
      try {
        const { getSupabaseBrowserClient } = await import('@/lib/supabase/client')
        const supabase = getSupabaseBrowserClient()
        
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price', { ascending: true })

        if (error) {
          console.error('Error fetching plans:', error)
          return
        }

        setPlans(data || [])
      } catch (error) {
        console.error('Error fetching plans:', error)
      }
    }

    fetchPlans()
  }, [])

  // Handle payment success callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const paymentSuccess = urlParams.get('payment') === 'success'
    const reference = urlParams.get('reference') // Paystack includes reference in callback URL
    
    if (paymentSuccess && reference) {
      // Verify payment with Paystack
      const verifyPayment = async () => {
        try {
          const response = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reference }),
          })

          const data = await response.json()

          if (response.ok && data.success) {
            // Payment verified successfully, refresh subscription
            refreshSubscription()
          } else {
            console.error('Payment verification failed:', data.error)
          }
        } catch (error) {
          console.error('Error verifying payment:', error)
        } finally {
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      }

      verifyPayment()
    } else if (paymentSuccess) {
      // If payment=success but no reference, just refresh (webhook might have handled it)
      refreshSubscription()
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [refreshSubscription])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "free":
        return <QrCode className="h-6 w-6" />
      case "pro":
        return <Crown className="h-6 w-6" />
      case "business":
        return <Star className="h-6 w-6" />
      default:
        return <QrCode className="h-6 w-6" />
    }
  }

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case "free":
        return "bg-gray-100 text-gray-800"
      case "pro":
        return "bg-orange-100 text-orange-800"
      case "business":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const currentPlanId = subscription?.plan_id || 'free'

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
            Current Plan
          </CardTitle>
          <CardDescription className="text-sm">
            Your current subscription details
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              {getPlanIcon(currentPlanId)}
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold capitalize text-base sm:text-lg">{subscription?.plan_name || 'Free'} Plan</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {currentPlanId === 'free' ? 'Perfect for getting started' :
                   currentPlanId === 'pro' ? 'Best for growing restaurants' :
                   'For restaurant chains and franchises'}
                </p>
                {subscription?.current_period_end && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <Badge className={getPlanColor(currentPlanId)}>
              {subscription?.status === 'active' ? 'Active' : subscription?.status || 'Active'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Choose Your Plan</h2>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PaymentButton
              key={plan.plan_id}
              planId={plan.plan_id}
              planName={plan.name}
              price={plan.price}
              currency={plan.currency}
              features={plan.features || []}
              limitations={plan.limitations || []}
              isPopular={plan.is_popular}
              isCurrentPlan={plan.plan_id === currentPlanId}
              onPaymentSuccess={refreshSubscription}
            />
          ))}
        </div>
      </div>

      {/* Coming Soon Features */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
            Coming Soon
          </CardTitle>
          <CardDescription className="text-sm">
            Exciting features we're working on
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold">Team Management</h4>
                <p className="text-sm text-muted-foreground">
                  Invite team members and manage permissions
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Palette className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold">Advanced Customization</h4>
                <p className="text-sm text-muted-foreground">
                  More design options and themes
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
