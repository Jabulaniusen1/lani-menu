import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { PaystackService } from '@/lib/paystack'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId, email } = await request.json()

    if (!planId || !email) {
      return NextResponse.json({ error: 'Plan ID and email are required' }, { status: 400 })
    }

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('plan_id', planId)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Generate unique reference
    const reference = `qr_menu_${uuidv4()}`

    // Initialize payment
    const paymentData = {
      email,
      amount: plan.price,
      currency: plan.currency,
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      metadata: {
        user_id: user.id,
        plan_id: planId,
        plan_name: plan.name
      }
    }

    const paymentResponse = await PaystackService.initializeTransaction(paymentData)

    if (!paymentResponse.status) {
      return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 400 })
    }

    // Store payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        paystack_reference: reference,
        amount: plan.price,
        currency: plan.currency,
        status: 'pending',
        gateway_response: paymentResponse
      })

    if (paymentError) {
      console.error('Error storing payment:', paymentError)
    }

    return NextResponse.json({
      success: true,
      authorization_url: paymentResponse.data.authorization_url,
      reference: paymentResponse.data.reference
    })

  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
