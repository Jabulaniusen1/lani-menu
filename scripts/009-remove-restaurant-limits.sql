-- Remove restaurant limits for all plans
-- This script updates the can_add_restaurant function to allow unlimited restaurants for all plans

-- Update the can_add_restaurant function to allow unlimited restaurants
CREATE OR REPLACE FUNCTION can_add_restaurant(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Always return true - no restaurant limits for any plan
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
