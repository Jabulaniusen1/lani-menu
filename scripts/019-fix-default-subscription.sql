-- Fix default subscription to ensure new users get 'free' plan
-- This script ensures the get_user_subscription function defaults to 'free' when no subscription exists

-- Update the function to properly default to 'free' plan
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

-- Optional: Clean up any test subscriptions that might have been created
-- Uncomment the following lines if you want to remove all subscriptions for users who haven't made payments
-- This will reset all users to the free plan

-- DELETE FROM user_subscriptions 
-- WHERE id NOT IN (
--   SELECT DISTINCT subscription_id 
--   FROM payments 
--   WHERE status = 'success' 
--     AND subscription_id IS NOT NULL
-- );

