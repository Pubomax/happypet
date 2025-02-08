/*
  # Fix pets table RLS policies

  1. Changes
    - Drop existing policies
    - Create new policies that properly handle the relationship between users and pets
    - Ensure authenticated users can create pets
    - Allow users to view and update their own pets
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create pets" ON pets;
DROP POLICY IF EXISTS "Users can view own pets" ON pets;
DROP POLICY IF EXISTS "Users can update own pets" ON pets;

-- Create new policies with proper user access
CREATE POLICY "Users can create pets"
  ON pets FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own pets"
  ON pets FOR SELECT
  TO authenticated
  USING (
    owner_id IN (
      SELECT id FROM profiles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own pets"
  ON pets FOR UPDATE
  TO authenticated
  USING (
    owner_id IN (
      SELECT id FROM profiles 
      WHERE user_id = auth.uid()
    )
  );