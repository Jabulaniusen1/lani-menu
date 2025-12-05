-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id VARCHAR(50) UNIQUE NOT NULL, -- 'free', 'pro', 'business'
  name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL, -- in kobo
  currency VARCHAR(3) NOT NULL DEFAULT 'NGN',
  interval_type VARCHAR(20) NOT NULL DEFAULT 'monthly', -- 'monthly', 'yearly'
  paystack_plan_code VARCHAR(100), -- Paystack plan code
  features JSONB DEFAULT '[]'::jsonb,
  limitations JSONB DEFAULT '[]'::jsonb,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) REFERENCES subscription_plans(plan_id),
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'past_due'
  paystack_subscription_id VARCHAR(100), -- Paystack subscription ID
  paystack_customer_code VARCHAR(100), -- Paystack customer code
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE CASCADE,
  paystack_reference VARCHAR(100) UNIQUE NOT NULL,
  paystack_transaction_id VARCHAR(100),
  amount INTEGER NOT NULL, -- in kobo
  currency VARCHAR(3) NOT NULL DEFAULT 'NGN',
  status VARCHAR(20) NOT NULL, -- 'pending', 'success', 'failed', 'cancelled'
  payment_method VARCHAR(50), -- 'card', 'bank_transfer', 'ussd', etc.
  gateway_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usage tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  menu_items_count INTEGER DEFAULT 0,
  restaurants_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, restaurant_id)
);

-- Insert default subscription plans (only if they don't exist)
INSERT INTO subscription_plans (plan_id, name, price, currency, interval_type, features, limitations, is_popular) VALUES
('free', 'Free', 0, 'NGN', 'monthly', 
 '["Up to 5 menu items", "1 restaurant location", "Basic QR code generation", "Standard menu design", "Email support"]'::jsonb,
 '["No custom branding", "No analytics", "No menu design customization"]'::jsonb,
 false),
('pro', 'Pro', 100000, 'NGN', 'yearly',
 '["Unlimited menu items", "Up to 3 restaurant locations", "Advanced QR code customization", "Premium menu designs", "Custom branding", "Advanced analytics", "Priority support"]'::jsonb,
 '[]'::jsonb,
 true),
('business', 'Business', 350000, 'NGN', 'yearly',
 '["Everything in Pro", "Unlimited restaurant locations", "Advanced analytics dashboard", "Team management", "API access", "White-label options", "Dedicated support"]'::jsonb,
 '[]'::jsonb,
 false)
ON CONFLICT (plan_id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(paystack_reference);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);

-- Create RLS policies
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Subscription plans are public (readable by all)
CREATE POLICY "Subscription plans are viewable by everyone" ON subscription_plans
  FOR SELECT USING (true);

-- Users can only see their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see their own payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only see their own usage tracking
CREATE POLICY "Users can view own usage tracking" ON usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage tracking" ON usage_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage tracking" ON usage_tracking
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to get user's current subscription
CREATE OR REPLACE FUNCTION get_user_subscription(user_uuid UUID)
RETURNS TABLE (
  subscription_id UUID,
  plan_id VARCHAR(50),
  plan_name VARCHAR(100),
  status VARCHAR(20),
  current_period_end TIMESTAMP WITH TIME ZONE,
  features JSONB,
  limitations JSONB
) AS $$
DECLARE
  subscription_exists BOOLEAN;
BEGIN
  -- Check if user has an active subscription
  SELECT EXISTS(
    SELECT 1 
    FROM user_subscriptions 
    WHERE user_id = user_uuid 
      AND status = 'active'
  ) INTO subscription_exists;
  
  -- If user has an active subscription, return it
  IF subscription_exists THEN
    RETURN QUERY
    SELECT 
      us.id,
      us.plan_id,
      sp.name,
      us.status,
      us.current_period_end,
      sp.features,
      sp.limitations
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.plan_id
    WHERE us.user_id = user_uuid
      AND us.status = 'active'
    ORDER BY us.created_at DESC
    LIMIT 1;
  ELSE
    -- If no subscription found, return free plan as default
    RETURN QUERY
    SELECT 
      NULL::UUID as subscription_id,
      'free'::VARCHAR(50) as plan_id,
      'Free'::VARCHAR(100) as plan_name,
      'active'::VARCHAR(20) as status,
      (NOW() + INTERVAL '1 year')::TIMESTAMP WITH TIME ZONE as current_period_end,
      sp.features,
      sp.limitations
    FROM subscription_plans sp
    WHERE sp.plan_id = 'free'
    LIMIT 1;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can add more menu items
CREATE OR REPLACE FUNCTION can_add_menu_item(user_uuid UUID, restaurant_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_plan VARCHAR(50);
  current_count INTEGER;
  plan_limit INTEGER;
BEGIN
  -- Get current plan
  SELECT plan_id INTO current_plan
  FROM user_subscriptions
  WHERE user_id = user_uuid AND status = 'active'
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If no active subscription, default to free plan
  IF current_plan IS NULL THEN
    current_plan := 'free';
  END IF;
  
  -- Get current menu items count
  SELECT COUNT(*) INTO current_count
  FROM menu_items
  WHERE restaurant_id = restaurant_uuid;
  
  -- Set limits based on plan
  CASE current_plan
    WHEN 'free' THEN plan_limit := 5;
    WHEN 'pro' THEN plan_limit := 999999; -- Unlimited
    WHEN 'business' THEN plan_limit := 999999; -- Unlimited
    ELSE plan_limit := 5; -- Default to free plan limit
  END CASE;
  
  RETURN current_count < plan_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can add more restaurants
CREATE OR REPLACE FUNCTION can_add_restaurant(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_plan VARCHAR(50);
  current_count INTEGER;
  plan_limit INTEGER;
BEGIN
  -- Get current plan
  SELECT plan_id INTO current_plan
  FROM user_subscriptions
  WHERE user_id = user_uuid AND status = 'active'
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If no active subscription, default to free plan
  IF current_plan IS NULL THEN
    current_plan := 'free';
  END IF;
  
  -- Get current restaurants count
  SELECT COUNT(*) INTO current_count
  FROM restaurants
  WHERE user_id = user_uuid;
  
  -- Set limits based on plan
  CASE current_plan
    WHEN 'free' THEN plan_limit := 1;
    WHEN 'pro' THEN plan_limit := 3;
    WHEN 'business' THEN plan_limit := 999999; -- Unlimited
    ELSE plan_limit := 1; -- Default to free plan limit
  END CASE;
  
  RETURN current_count < plan_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
