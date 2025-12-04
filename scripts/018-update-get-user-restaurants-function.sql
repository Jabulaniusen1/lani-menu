-- Update get_user_restaurants function to include menu_type, pdf_menu_url, menu_layout, menu_theme, and menu_font
-- This ensures the dashboard receives all necessary restaurant data on load

-- Drop the existing function first since we're changing the return type
DROP FUNCTION IF EXISTS get_user_restaurants(UUID);

-- Recreate the function with the updated return type
CREATE FUNCTION get_user_restaurants(user_uuid UUID)
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
  pdf_menu_url TEXT,
  menu_type VARCHAR,
  menu_layout VARCHAR,
  menu_theme VARCHAR,
  menu_font VARCHAR,
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
    r.pdf_menu_url,
    r.menu_type,
    r.menu_layout,
    r.menu_theme,
    r.menu_font,
    r.created_at,
    r.updated_at,
    ur.is_primary
  FROM restaurants r
  JOIN user_restaurants ur ON r.id = ur.restaurant_id
  WHERE ur.user_id = user_uuid
  ORDER BY ur.is_primary DESC, r.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_user_restaurants(UUID) TO authenticated;

