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
      .select('*, user_id, metadata')
      .eq('paystack_reference', reference)
      .single()

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    const userId = payment.user_id
    const planId = paymentData.metadata?.plan_id

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID not found in payment metadata' }, { status: 400 })
    }

    // Cancel any existing active subscription
    await supabase
      .from('user_subscriptions')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('status', 'active')

    // Create new subscription
    const currentDate = new Date()
    const nextMonth = new Date(currentDate)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    const { error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        paystack_customer_code: paymentData.customer?.customer_code,
        current_period_start: currentDate.toISOString(),
        current_period_end: nextMonth.toISOString()
      })

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError)
      return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription created successfully',
      subscription: {
        plan_id: planId,
        status: 'active',
        current_period_end: nextMonth.toISOString()
      }
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
