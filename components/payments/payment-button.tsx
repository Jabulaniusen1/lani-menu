"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, CreditCard, Loader2 } from 'lucide-react'
import { useNotification } from '@/hooks/use-notification'
import { useSubscription } from '@/contexts/subscription-context'

interface PaymentButtonProps {
  planId: string
  planName: string
  price: number
  currency: string
  features: string[]
  limitations: string[]
  isPopular?: boolean
  isCurrentPlan?: boolean
  onPaymentSuccess?: () => void
}

export function PaymentButton({
  planId,
  planName,
  price,
  currency,
  features,
  limitations,
  isPopular = false,
  isCurrentPlan = false,
  onPaymentSuccess
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const { notify } = useNotification()
  const { refreshSubscription } = useSubscription()

  const handlePayment = async () => {
    if (isCurrentPlan) return

    setLoading(true)
    try {
      // Get user email from Supabase
      const { getSupabaseBrowserClient } = await import('@/lib/supabase/client')
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user?.email) {
        notify.error('Please sign in to continue', 'Authentication required')
        return
      }

      // Initialize payment
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          email: user.email
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment')
      }

      // Redirect to Paystack payment page
      window.location.href = data.authorization_url

    } catch (error) {
      console.error('Payment error:', error)
      notify.error('Payment failed', error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (amount: number, currency: string) => {
    if (amount === 0) return 'Free'
    
    const formatter = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    })
    
    return formatter.format(amount) // Amount is already in NGN
  }

  return (
    <Card className={`relative ${isPopular ? 'ring-2 ring-orange-500 shadow-lg' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-orange-500 text-white">
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{planName}</CardTitle>
        <div className="text-3xl font-bold">
          {formatPrice(price, currency)}
          {price > 0 && <span className="text-sm font-normal text-muted-foreground">/year</span>}
        </div>
        <CardDescription>
          {planId === 'free' ? 'Perfect for getting started' : 
           planId === 'pro' ? 'Best for growing restaurants' : 
           'For restaurant chains and franchises'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        {limitations.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Limitations:</p>
            <ul className="space-y-1">
              {limitations.map((limitation, index) => (
                <li key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0" />
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button 
          className="w-full" 
          variant={isCurrentPlan ? "outline" : isPopular ? "default" : "outline"}
          disabled={isCurrentPlan || loading}
          onClick={handlePayment}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : isCurrentPlan ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Current Plan
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              {price === 0 ? 'Get Started' : 'Subscribe Now'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
