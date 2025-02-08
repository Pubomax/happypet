-- Add health metrics columns if they don't exist
DO $$ 
BEGIN
  -- Add height column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'height'
  ) THEN
    ALTER TABLE pets ADD COLUMN height decimal;
  END IF;

  -- Add temperature column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'temperature'
  ) THEN
    ALTER TABLE pets ADD COLUMN temperature decimal;
  END IF;

  -- Add heart_rate column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'heart_rate'
  ) THEN
    ALTER TABLE pets ADD COLUMN heart_rate integer;
  END IF;

  -- Add activity_level column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pets' AND column_name = 'activity_level'
  ) THEN
    ALTER TABLE pets ADD COLUMN activity_level text;
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for users based on profile" ON pets;
DROP POLICY IF EXISTS "Enable select for users based on profile" ON pets;
DROP POLICY IF EXISTS "Enable update for users based on profile" ON pets;

-- Create new policies with proper user access
CREATE POLICY "Enable insert for authenticated users" ON pets
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable select for pet owners" ON pets
  FOR SELECT TO authenticated
  USING (owner_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Enable update for pet owners" ON pets
  FOR UPDATE TO authenticated
  USING (owner_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));