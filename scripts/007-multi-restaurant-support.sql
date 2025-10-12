-- Multi-Restaurant Support Migration
-- This script adds support for multiple restaurants per user account

-- 1. Add a 'restaurants' table if it doesn't exist (it should already exist from previous migrations)
-- The existing restaurants table already has user_id, so we're good there

-- 2. Add a 'user_restaurants' junction table for better management
CREATE TABLE IF NOT EXISTS user_restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, restaurant_id)
);

-- 3. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_restaurants_user_id ON user_restaurants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_restaurants_restaurant_id ON user_restaurants(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_user_restaurants_primary ON user_restaurants(user_id, is_primary) WHERE is_primary = TRUE;

-- 4. Migrate existing restaurants to user_restaurants table
INSERT INTO user_restaurants (user_id, restaurant_id, is_primary)
SELECT 
  r.user_id, 
  r.id, 
  TRUE
FROM restaurants r
WHERE NOT EXISTS (
  SELECT 1 FROM user_restaurants ur 
  WHERE ur.user_id = r.user_id AND ur.restaurant_id = r.id
);

-- 5. Add RLS policies for user_restaurants table
ALTER TABLE user_restaurants ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own restaurant associations
CREATE POLICY "Users can view their own restaurant associations" ON user_restaurants
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own restaurant associations
CREATE POLICY "Users can insert their own restaurant associations" ON user_restaurants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own restaurant associations
CREATE POLICY "Users can update their own restaurant associations" ON user_restaurants
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own restaurant associations
CREATE POLICY "Users can delete their own restaurant associations" ON user_restaurants
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Add a function to ensure only one primary restaurant per user
CREATE OR REPLACE FUNCTION ensure_single_primary_restaurant()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting a restaurant as primary, unset all other primaries for this user
  IF NEW.is_primary = TRUE THEN
    UPDATE user_restaurants 
    SET is_primary = FALSE 
    WHERE user_id = NEW.user_id 
      AND id != NEW.id 
      AND is_primary = TRUE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger to enforce single primary restaurant
DROP TRIGGER IF EXISTS trigger_ensure_single_primary_restaurant ON user_restaurants;
CREATE TRIGGER trigger_ensure_single_primary_restaurant
  BEFORE INSERT OR UPDATE ON user_restaurants
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_primary_restaurant();

-- 8. Add a function to get user's restaurants with primary status
CREATE OR REPLACE FUNCTION get_user_restaurants(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  currency TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  is_primary BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.name,
    r.slug,
    r.description,
    r.phone,
    r.address,
    r.website,
    r.currency,
    r.logo_url,
    r.created_at,
    r.updated_at,
    ur.is_primary
  FROM restaurants r
  JOIN user_restaurants ur ON r.id = ur.restaurant_id
  WHERE ur.user_id = user_uuid
  ORDER BY ur.is_primary DESC, r.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Add a function to get user's primary restaurant
CREATE OR REPLACE FUNCTION get_user_primary_restaurant(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  currency TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.name,
    r.slug,
    r.description,
    r.phone,
    r.address,
    r.website,
    r.currency,
    r.logo_url,
    r.created_at,
    r.updated_at
  FROM restaurants r
  JOIN user_restaurants ur ON r.id = ur.restaurant_id
  WHERE ur.user_id = user_uuid AND ur.is_primary = TRUE
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_user_restaurants(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_primary_restaurant(UUID) TO authenticated;
