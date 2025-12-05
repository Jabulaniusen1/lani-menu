import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { PaystackService } from '@/lib/paystack'
import { v4 as uuidv4 } from 'uuid'
import { getCountryFromCookie } from '@/lib/country-utils'
import { getCountryPricing, getCountryConfig, isSupportedCountry, getDefaultCountry, BillingPeriod } from '@/lib/country-pricing'

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId, email, billingPeriod = 'monthly' } = await request.json()

    if (!planId || !email) {
      return NextResponse.json({ error: 'Plan ID and email are required' }, { status: 400 })
    }

    // Validate billing period
    if (billingPeriod !== 'monthly' && billingPeriod !== 'yearly') {
      return NextResponse.json({ error: 'Invalid billing period' }, { status: 400 })
    }

    // Get user's country from cookie
    let countryCode: string
    try {
      const countryCookie = request.cookies.get('user_country')
      if (countryCookie?.value && isSupportedCountry(countryCookie.value)) {
        countryCode = countryCookie.value.toUpperCase()
      } else {
        countryCode = getDefaultCountry()
      }
    } catch (error) {
      console.error('Error reading country cookie:', error)
      countryCode = getDefaultCountry()
    }

    // Get country configuration and pricing
    const countryConfig = getCountryConfig(countryCode)
    const countryPricing = getCountryPricing(countryCode as any, billingPeriod as BillingPeriod)

    if (!countryConfig) {
      return NextResponse.json({ error: 'Unsupported country' }, { status: 400 })
    }

    // Map planId to pricing tier
    let amount: number
    if (planId === 'free') {
      amount = countryPricing.free
    } else if (planId === 'pro') {
      amount = countryPricing.pro
    } else if (planId === 'business') {
      amount = countryPricing.business
    } else {
      // Fallback: try to get from database
      const { data: plan } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('plan_id', planId)
      .single()

      if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
      }

      // If plan has country-specific pricing, use it; otherwise use calculated pricing
      amount = plan.price || countryPricing.pro
    }

    // Generate unique reference
    const reference = `qr_menu_${uuidv4()}`

    // Initialize payment with country-specific currency and amount
    // Note: PaystackService will convert to smallest currency unit (kobo, pesewa, etc.)
    // Ensure currency is uppercase for Paystack API
    const currency = countryConfig.currency.toUpperCase()
    
    console.log('Payment initialization:', {
      country: countryCode,
      currency: currency,
      amount: amount,
      planId,
      billingPeriod
    })
    
    const paymentData: any = {
      email,
      amount: amount, // Will be converted to smallest unit by PaystackService
      currency: currency,
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success&reference=${reference}`,
      metadata: {
        user_id: user.id,
        plan_id: planId,
        plan_name: planId === 'free' ? 'Free' : planId === 'pro' ? 'Pro' : 'Business',
        interval_type: billingPeriod === 'monthly' ? 'monthly' : 'yearly',
        billing_period: billingPeriod,
        country: countryCode,
        original_amount: amount,
        original_currency: currency
      }
    }

    // Note: Paystack plan codes are country-specific, so we don't use them here
    // Instead, we use one-time transactions with the correct currency

    const paymentResponse = await PaystackService.initializeTransaction(paymentData)

    if (!paymentResponse.status) {
      console.error('Paystack initialization failed:', paymentResponse)
      return NextResponse.json({ 
        error: 'Failed to initialize payment',
        details: paymentResponse.message || 'Payment gateway error'
      }, { status: 400 })
    }
    
    // Log the response to verify currency is correct
    console.log('Paystack transaction initialized:', {
      reference: paymentResponse.data.reference,
      currency: paymentResponse.data.currency,
      amount: paymentResponse.data.amount,
      authorization_url: paymentResponse.data.authorization_url
    })

    // Store payment record with metadata for easy retrieval
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        paystack_reference: reference,
        amount: amount,
        currency: countryConfig.currency,
        status: 'pending',
        gateway_response: {
          ...paymentResponse,
          initialization_metadata: {
            plan_id: planId,
            plan_name: planId === 'free' ? 'Free' : planId === 'pro' ? 'Pro' : 'Business',
            interval_type: billingPeriod === 'monthly' ? 'monthly' : 'yearly',
            billing_period: billingPeriod,
            country: countryCode,
            original_amount: amount,
            original_currency: countryConfig.currency
          }
        }
      })

    if (paymentError) {
      console.error('Error storing payment:', paymentError)
    }

    return NextResponse.json({
      success: true,
      authorization_url: paymentResponse.data.authorization_url,
      reference: paymentResponse.data.reference,
      country: countryCode,
      currency: countryConfig.currency,
      amount: amount
    })

  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
