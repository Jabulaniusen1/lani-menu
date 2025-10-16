import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 })
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const supabase = await getSupabaseServerClient()

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data, supabase)
        break
      
      case 'subscription.create':
        await handleSubscriptionCreate(event.data, supabase)
        break
      
      case 'subscription.disable':
        await handleSubscriptionDisable(event.data, supabase)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data, supabase)
        break
      
      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleChargeSuccess(data: any, supabase: any) {
  const { reference, customer, amount, status } = data

  if (status === 'success') {
    // Update payment status
    await supabase
      .from('payments')
      .update({
        status: 'success',
        paystack_transaction_id: data.id,
        payment_method: data.channel,
        gateway_response: data
      })
      .eq('paystack_reference', reference)

    // Get payment details to create subscription
    const { data: payment } = await supabase
      .from('payments')
      .select('user_id, metadata')
      .eq('paystack_reference', reference)
      .single()

    if (payment && data.metadata?.plan_id) {
      const userId = payment.user_id
      const planId = data.metadata.plan_id

      // Cancel existing subscription
      await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('status', 'active')

      // Create new subscription
      const currentDate = new Date()
      const nextMonth = new Date(currentDate)
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          status: 'active',
          paystack_customer_code: customer?.customer_code,
          current_period_start: currentDate.toISOString(),
          current_period_end: nextMonth.toISOString()
        })
    }
  }
}

async function handleSubscriptionCreate(data: any, supabase: any) {
  // Handle subscription creation
  console.log('Subscription created:', data)
}

async function handleSubscriptionDisable(data: any, supabase: any) {
  // Handle subscription cancellation
  const { subscription_code } = data

  await supabase
    .from('user_subscriptions')
    .update({ 
      status: 'cancelled',
      cancelled_at: new Date().toISOString()
    })
    .eq('paystack_subscription_id', subscription_code)
}

async function handlePaymentFailed(data: any, supabase: any) {
  // Handle failed payments
  const { subscription } = data

  await supabase
    .from('user_subscriptions')
    .update({ status: 'past_due' })
    .eq('paystack_subscription_id', subscription.subscription_code)
}
