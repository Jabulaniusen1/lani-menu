-- Update menu_font constraint to include all new playful fonts
-- This script updates the CHECK constraint to allow all the new font options

-- Drop the existing constraint
ALTER TABLE restaurants 
DROP CONSTRAINT IF EXISTS restaurants_menu_font_check;

-- Add the updated constraint with all fonts
ALTER TABLE restaurants 
ADD CONSTRAINT restaurants_menu_font_check 
CHECK (menu_font IN (
  'inter', 
  'roboto', 
  'playfair', 
  'montserrat', 
  'lora', 
  'opensans', 
  'raleway', 
  'fredoka', 
  'comfortaa', 
  'quicksand', 
  'nunito', 
  'poppins', 
  'dancingscript', 
  'pacifico', 
  'caveat', 
  'kalam', 
  'permanentmarker'
));

-- Update any existing restaurants with invalid font values to 'inter'
UPDATE restaurants 
SET menu_font = 'inter' 
WHERE menu_font NOT IN (
  'inter', 
  'roboto', 
  'playfair', 
  'montserrat', 
  'lora', 
  'opensans', 
  'raleway', 
  'fredoka', 
  'comfortaa', 
  'quicksand', 
  'nunito', 
  'poppins', 
  'dancingscript', 
  'pacifico', 
  'caveat', 
  'kalam', 
  'permanentmarker'
);

