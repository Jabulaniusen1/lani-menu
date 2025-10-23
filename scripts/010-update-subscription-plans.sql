-- Update subscription plans to reflect unlimited restaurants for all plans
-- This script updates the existing subscription plan records in the database

-- Update Free plan to show unlimited restaurants
UPDATE subscription_plans 
SET features = '["Up to 5 menu items", "Unlimited restaurant locations", "Basic QR code generation", "Standard menu design", "Email support"]'::jsonb
WHERE plan_id = 'free';

-- Update Pro plan to show unlimited restaurants
UPDATE subscription_plans 
SET features = '["Unlimited menu items", "Unlimited restaurant locations", "Advanced QR code customization", "Premium menu designs", "Custom branding", "Advanced analytics", "Priority support"]'::jsonb
WHERE plan_id = 'pro';

-- Business plan already has unlimited restaurants, so no update needed
