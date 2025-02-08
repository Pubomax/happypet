-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON pets;
DROP POLICY IF EXISTS "Enable select for pet owners" ON pets;
DROP POLICY IF EXISTS "Enable update for pet owners" ON pets;

-- Create new policies with proper user access
CREATE POLICY "Enable insert for authenticated users" ON pets
  FOR INSERT TO authenticated
  WITH CHECK (owner_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

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