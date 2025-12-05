import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { PaystackService } from '@/lib/paystack'

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json({ error: 'Reference is required' }, { status: 400 })
    }

    // Verify payment with Paystack
    const verificationResponse = await PaystackService.verifyTransaction(reference)

    if (!verificationResponse.status) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    const paymentData = verificationResponse.data

    // Check if payment was successful
    if (paymentData.status !== 'success') {
      return NextResponse.json({ error: 'Payment not successful' }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    // Update payment status
    const { error: paymentUpdateError } = await supabase
      .from('payments')
      .update({
        status: 'success',
        paystack_transaction_id: paymentData.id,
        payment_method: paymentData.channel,
        gateway_response: paymentData
      })
      .eq('paystack_reference', reference)

    if (paymentUpdateError) {
      console.error('Error updating payment:', paymentUpdateError)
    }

    // Get payment details
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*, user_id, gateway_response')
      .eq('paystack_reference', reference)
      .single()

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    const userId = payment.user_id
    
    // Get plan_id from various possible locations
    let planId = paymentData.metadata?.plan_id
    
    // If not in Paystack verification response, get from stored initialization metadata
    if (!planId && payment.gateway_response) {
      planId = payment.gateway_response?.initialization_metadata?.plan_id ||
               payment.gateway_response?.data?.metadata?.plan_id ||
               payment.gateway_response?.metadata?.plan_id
    }

    if (!planId) {
      console.error('Plan ID not found. Payment data:', {
        paymentDataMetadata: paymentData.metadata,
        gatewayResponseKeys: payment.gateway_response ? Object.keys(payment.gateway_response) : null,
        reference
      })
      return NextResponse.json({ error: 'Plan ID not found in payment metadata' }, { status: 400 })
    }

    // Get plan details to determine interval type
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('interval_type')
      .eq('plan_id', planId)
      .single()

    // Cancel any existing active subscription
    await supabase
      .from('user_subscriptions')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('status', 'active')

    // Create new subscription with correct period based on interval_type
    const currentDate = new Date()
    const periodEnd = new Date(currentDate)
    
    // Calculate period end based on interval type
    if (plan?.interval_type === 'yearly') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    } else {
      // Default to monthly
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    }

    console.log('Creating subscription:', {
      user_id: userId,
      plan_id: planId,
      status: 'active',
      current_period_start: currentDate.toISOString(),
      current_period_end: periodEnd.toISOString()
    })

    const { data: newSubscription, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        paystack_customer_code: paymentData.customer?.customer_code,
        paystack_subscription_id: paymentData.subscription?.subscription_code || null,
        current_period_start: currentDate.toISOString(),
        current_period_end: periodEnd.toISOString()
      })
      .select()
      .single()

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError)
      return NextResponse.json({ error: 'Failed to create subscription', details: subscriptionError.message }, { status: 500 })
    }

    console.log('Subscription created successfully:', newSubscription)

    // Verify the subscription was created and can be retrieved
    const { data: verifySubscription, error: verifyError } = await supabase
      .from('user_subscriptions')
      .select('*, subscription_plans(name)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (verifyError) {
      console.error('Error verifying subscription creation:', verifyError)
    } else {
      console.log('Verified subscription exists:', verifySubscription)
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription created successfully',
      subscription: {
        plan_id: planId,
        status: 'active',
        current_period_end: periodEnd.toISOString()
      },
      subscription_id: newSubscription?.id
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
