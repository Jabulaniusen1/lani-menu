-- Update subscription plans with Paystack plan codes
-- This script updates the existing subscription plan records with their Paystack plan codes

-- Update Pro plan with Paystack plan code
UPDATE subscription_plans 
SET paystack_plan_code = 'PLN_5nznzsyn81g57dx',
    updated_at = NOW()
WHERE plan_id = 'pro';

-- Note: Update Business plan when you have its Paystack plan code
-- UPDATE subscription_plans 
-- SET paystack_plan_code = 'PLN_your_business_plan_code',
--     updated_at = NOW()
-- WHERE plan_id = 'business';

