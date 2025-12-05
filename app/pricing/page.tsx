"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode } from "lucide-react"
import { PaymentButton } from "@/components/payments/payment-button"
import { CountrySelector } from "@/components/payments/country-selector"
import { BillingPeriodToggle } from "@/components/payments/billing-period-toggle"
import { useEffect, useState } from "react"
import { SupportedCountry, getCountryConfig, getCountryPricing, BillingPeriod } from "@/lib/country-pricing"
import { getCountryFromCookieClient } from "@/lib/country-utils"

export default function PricingPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [selectedCountry, setSelectedCountry] = useState<SupportedCountry | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')

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
    
    // Initialize selected country from cookie
    const countryFromCookie = getCountryFromCookieClient()
    setSelectedCountry(countryFromCookie)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <QrCode className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Lani Menu</span>
            </Link>
            <div className="flex gap-3">
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>  
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="text-center space-y-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl font-bold leading-tight text-balance">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Choose the perfect plan for your restaurant. All plans include a 14-day free trial.
          </p>
          
          {/* Billing Period Toggle */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <BillingPeriodToggle
              period={billingPeriod}
              onPeriodChange={setBillingPeriod}
            />
            
            {/* Country Selector */}
            {selectedCountry && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-muted-foreground">View prices for:</p>
                <CountrySelector
                  value={selectedCountry}
                  onValueChange={setSelectedCountry}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20 max-w-7xl">
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading pricing plans...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <PaymentButton
                key={plan.plan_id}
                planId={plan.plan_id}
                planName={plan.name}
                price={plan.price}
                currency={plan.currency}
                features={plan.features || []}
                limitations={plan.limitations || []}
                isPopular={plan.is_popular}
                isCurrentPlan={false}
                selectedCountry={selectedCountry || undefined}
                billingPeriod={billingPeriod}
                onBillingPeriodChange={setBillingPeriod}
              />
            ))}
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll
                  prorate any charges.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  We accept all major credit cards (Visa, MasterCard, American Express) and PayPal for your convenience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a setup fee?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  No setup fees! You only pay the monthly subscription price. Start your 14-day free trial with no
                  credit card required.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Absolutely. Cancel your subscription at any time with no penalties. Your menu will remain active until
                  the end of your billing period.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <Card className="bg-primary text-primary-foreground animate-in fade-in zoom-in-95 duration-700">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Modernize Your Menu?</h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Start your 14-day free trial today. No credit card required.
            </p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="h-12 px-8 text-base">
                Get Started Free
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 QR Menu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
