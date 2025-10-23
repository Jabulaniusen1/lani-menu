import Paystack from 'paystack'

// Initialize Paystack with secret key
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY!)

export interface PaymentPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: string[]
  limitations: string[]
  popular?: boolean
}

export const SUBSCRIPTION_PLANS: PaymentPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'NGN',
    interval: 'monthly',
    features: [
      'Up to 5 menu items',
      'Unlimited restaurant locations',
      'Basic QR code generation',
      'Standard menu design',
      'Email support'
    ],
    limitations: [
      'No custom branding',
      'No analytics',
      'No menu design customization'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 100000, // ₦100,000 per year
    currency: 'NGN',
    interval: 'yearly',
    features: [
      'Unlimited menu items',
      'Unlimited restaurant locations',
      'Advanced QR code customization',
      'Premium menu designs',
      'Custom branding',
      'Advanced analytics',
      'Priority support'
    ],
    limitations: [],
    popular: true
  },
  {
    id: 'business',
    name: 'Business',
    price: 350000, // ₦350,000 per year
    currency: 'NGN',
    interval: 'yearly',
    features: [
      'Everything in Pro',
      'Unlimited restaurant locations',
      'Advanced analytics dashboard',
      'Team management',
      'API access',
      'White-label options',
      'Dedicated support'
    ],
    limitations: []
  }
]

export interface CreateSubscriptionData {
  customer_email: string
  plan_code: string
  start_date?: string
  authorization_code?: string
}

export interface PaymentData {
  email: string
  amount: number
  currency: string
  reference: string
  callback_url?: string
  metadata?: Record<string, any>
}

export class PaystackService {
  // Initialize transaction
  static async initializeTransaction(data: PaymentData) {
    try {
      const response = await paystack.transaction.initialize({
        email: data.email,
        amount: data.amount * 100, // Convert to kobo
        currency: data.currency,
        reference: data.reference,
        callback_url: data.callback_url,
        metadata: data.metadata
      })
      return response
    } catch (error) {
      console.error('Error initializing transaction:', error)
      throw error
    }
  }

  // Verify transaction
  static async verifyTransaction(reference: string) {
    try {
      const response = await paystack.transaction.verify(reference)
      return response
    } catch (error) {
      console.error('Error verifying transaction:', error)
      throw error
    }
  }

  // Create subscription plan
  static async createPlan(plan: Omit<PaymentPlan, 'id'>) {
    try {
      const response = await paystack.plan.create({
        name: plan.name,
        interval: plan.interval,
        amount: plan.price * 100, // Convert to kobo
        currency: plan.currency
      })
      return response
    } catch (error) {
      console.error('Error creating plan:', error)
      throw error
    }
  }

  // Create subscription
  static async createSubscription(data: CreateSubscriptionData) {
    try {
      const response = await paystack.subscription.create({
        customer: data.customer_email,
        plan: data.plan_code,
        authorization: data.authorization_code
      })
      return response
    } catch (error) {
      console.error('Error creating subscription:', error)
      throw error
    }
  }

  // Get subscription
  static async getSubscription(subscriptionId: string) {
    try {
      const response = await paystack.subscription.fetch(subscriptionId)
      return response
    } catch (error) {
      console.error('Error fetching subscription:', error)
      throw error
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string) {
    try {
      const response = await paystack.subscription.disable({
        code: subscriptionId,
        token: 'disable_token' // You'll need to implement proper token generation
      })
      return response
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw error
    }
  }
}

export default paystack
