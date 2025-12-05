"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, CreditCard, Loader2 } from 'lucide-react'
import { useNotification } from '@/hooks/use-notification'
import { useSubscription } from '@/contexts/subscription-context'
import { getCountryPricingInfoClient, getCountryFromCookieClient } from '@/lib/country-utils'
import { formatPrice, getCountryPricing, getCountryConfig, SupportedCountry, BillingPeriod } from '@/lib/country-pricing'

interface PaymentButtonProps {
  planId: string
  planName: string
  price?: number // Optional, will be calculated from country if not provided
  currency?: string // Optional, will be determined from country if not provided
  features: string[]
  limitations: string[]
  isPopular?: boolean
  isCurrentPlan?: boolean
  onPaymentSuccess?: () => void
  selectedCountry?: SupportedCountry // Optional override for selected country
  billingPeriod?: BillingPeriod // Monthly or yearly billing
  onBillingPeriodChange?: (period: BillingPeriod) => void // Callback when billing period changes
}

export function PaymentButton({
  planId,
  planName,
  price: propPrice,
  currency: propCurrency,
  features,
  limitations,
  isPopular = false,
  isCurrentPlan = false,
  onPaymentSuccess,
  selectedCountry,
  billingPeriod = 'monthly',
  onBillingPeriodChange
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const [countryInfo, setCountryInfo] = useState<{
    country: string
    config: any
    pricing: any
  } | null>(null)
  const [isLoadingCountry, setIsLoadingCountry] = useState(true)
  const { notify } = useNotification()
  const { refreshSubscription } = useSubscription()

  // Get country-based pricing
  useEffect(() => {
    setIsLoadingCountry(true)
    try {
      // If selectedCountry is provided, use it; otherwise use cookie
      if (selectedCountry) {
        const config = getCountryConfig(selectedCountry)
        const pricing = getCountryPricing(selectedCountry, billingPeriod)
        if (config) {
          setCountryInfo({
            country: selectedCountry,
            config,
            pricing
          })
        }
      } else {
        const info = getCountryPricingInfoClient(billingPeriod)
        setCountryInfo(info)
      }
    } catch (error) {
      console.error('Error loading country pricing:', error)
      // Fallback to default
      const defaultCountry: SupportedCountry = 'NG'
      const config = getCountryConfig(defaultCountry)
      const pricing = getCountryPricing(defaultCountry, billingPeriod)
      if (config) {
        setCountryInfo({
          country: defaultCountry,
          config,
          pricing
        })
      }
    } finally {
      setIsLoadingCountry(false)
    }
  }, [selectedCountry, billingPeriod])

  // Calculate price and currency based on country
  const getPriceAndCurrency = () => {
    if (!countryInfo) {
      // Fallback to props or defaults
      return {
        price: propPrice || 0,
        currency: propCurrency || 'NGN'
      }
    }

    const { pricing, config } = countryInfo
    
    let price = 0
    if (planId === 'free') {
      price = pricing.free
    } else if (planId === 'pro') {
      price = pricing.pro
    } else if (planId === 'business') {
      price = pricing.business
    } else {
      price = propPrice || pricing.pro
    }

    return {
      price,
      currency: config.currency
    }
  }

  const { price, currency } = getPriceAndCurrency()

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
          email: user.email,
          billingPeriod: billingPeriod
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

  const formatPriceDisplay = (amount: number, currency: string) => {
    return formatPrice(amount, currency, 'en')
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
        {isLoadingCountry ? (
          <div className="text-3xl font-bold text-muted-foreground">Loading...</div>
        ) : (
          <>
            <div className="text-3xl font-bold">
              {formatPriceDisplay(price, currency)}
              {price > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  /{billingPeriod === 'monthly' ? 'month' : 'year'}
                </span>
              )}
            </div>
            {countryInfo && (
              <div className="text-xs text-muted-foreground mt-1">
                {countryInfo.config.flag} {countryInfo.config.name}
              </div>
            )}
            {billingPeriod === 'yearly' && price > 0 && (
              <div className="text-xs text-green-600 font-medium mt-1">
                Save 2 months (16.67% off)
              </div>
            )}
          </>
        )}
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
