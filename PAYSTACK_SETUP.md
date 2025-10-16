# Paystack Integration Setup Guide

This guide will help you set up Paystack payment integration for your QR Menu application.

## Prerequisites

1. **Paystack Account**: Sign up at [paystack.com](https://paystack.com)
2. **Supabase Project**: Ensure your Supabase project is set up
3. **Environment Variables**: Configure the required environment variables

## Environment Variables

Add these to your `.env.local` file:

```env
# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Setup

1. **Run the subscription schema migration**:
   ```sql
   -- Execute the contents of scripts/008-paystack-subscriptions.sql
   -- This creates the necessary tables for subscriptions and payments
   ```

2. **Verify tables are created**:
   - `subscription_plans`
   - `user_subscriptions`
   - `payments`
   - `usage_tracking`

## Paystack Dashboard Configuration

### 1. Create Plans in Paystack Dashboard

1. Go to your Paystack Dashboard
2. Navigate to **Settings > Plans**
3. Create plans for each subscription tier:
   - **Free Plan**: ₦0/month
   - **Pro Plan**: ₦1,900/month
   - **Business Plan**: ₦4,900/month

### 2. Set Up Webhooks

1. Go to **Settings > Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/payments/webhook`
3. Select events to listen for:
   - `charge.success`
   - `subscription.create`
   - `subscription.disable`
   - `invoice.payment_failed`
4. Copy the webhook secret and add it to your environment variables

### 3. Test Mode vs Live Mode

- **Test Mode**: Use `pk_test_` and `sk_test_` keys for development
- **Live Mode**: Use `pk_live_` and `sk_live_` keys for production

## Features Implemented

### ✅ Payment Processing
- Initialize payments with Paystack
- Verify payment status
- Handle payment success/failure

### ✅ Subscription Management
- Create user subscriptions
- Track subscription status
- Handle plan upgrades/downgrades

### ✅ Plan Restrictions
- **Free Plan**: 5 menu items, 1 restaurant
- **Pro Plan**: Unlimited menu items, 3 restaurants
- **Business Plan**: Unlimited everything

### ✅ UI Components
- Payment buttons with plan details
- Subscription status display
- Usage indicators
- Upgrade prompts

### ✅ API Routes
- `/api/payments/initialize` - Start payment process
- `/api/payments/verify` - Verify payment completion
- `/api/payments/webhook` - Handle Paystack webhooks

## Testing

### 1. Test Cards (Test Mode)
Use these test card numbers:
- **Success**: 4084084084084081
- **Insufficient Funds**: 4084084084084085
- **Invalid Card**: 4084084084084082

### 2. Test Flow
1. Sign up for a new account
2. Try to add more than 5 menu items (should show upgrade prompt)
3. Try to add more than 1 restaurant (should show upgrade prompt)
4. Go to billing tab and test payment flow
5. Verify subscription is created after successful payment

## Production Deployment

### 1. Environment Variables
Update your production environment with live Paystack keys:
```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key
PAYSTACK_WEBHOOK_SECRET=your_production_webhook_secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2. Webhook URL
Update webhook URL in Paystack dashboard to your production domain:
`https://yourdomain.com/api/payments/webhook`

### 3. Database Migration
Run the subscription schema migration on your production database.

## Monitoring

### 1. Paystack Dashboard
- Monitor transactions in real-time
- View subscription status
- Check webhook delivery status

### 2. Application Logs
- Payment initialization logs
- Webhook processing logs
- Subscription creation logs

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check webhook URL is correct
   - Verify webhook secret matches
   - Check server logs for errors

2. **Payment verification failing**
   - Ensure reference is correct
   - Check if payment was actually successful
   - Verify Paystack secret key

3. **Subscription not created**
   - Check webhook processing
   - Verify database permissions
   - Check user authentication

### Debug Mode
Enable debug logging by adding to your environment:
```env
DEBUG_PAYSTACK=true
```

## Support

For Paystack-specific issues:
- [Paystack Documentation](https://paystack.com/docs)
- [Paystack Support](https://paystack.com/support)

For application issues:
- Check application logs
- Verify database schema
- Test with Paystack test cards
