/*
  # Fix duplicate policies and add missing policies

  1. Changes
    - Drop any existing duplicate policies safely
    - Add any missing policies
    - Ensure unique policy names
  
  2. Security
    - Maintain RLS on all tables
    - Ensure proper access control
*/

-- Safely drop and recreate policies for medical_records
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable all access for users based on pet ownership" ON medical_records;
  
  CREATE POLICY "Medical records access policy" ON medical_records
    FOR ALL USING (
      pet_id IN (
        SELECT id FROM pets WHERE owner_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      )
    );
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Safely drop and recreate policies for vaccinations
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable all access for users based on pet ownership" ON vaccinations;
  
  CREATE POLICY "Vaccinations access policy" ON vaccinations
    FOR ALL USING (
      pet_id IN (
        SELECT id FROM pets WHERE owner_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      )
    );
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Safely drop and recreate policies for medications
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable all access for users based on pet ownership" ON medications;
  
  CREATE POLICY "Medications access policy" ON medications
    FOR ALL USING (
      pet_id IN (
        SELECT id FROM pets WHERE owner_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      )
    );
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Safely drop and recreate policies for emergency_contacts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable all access for users based on pet ownership" ON emergency_contacts;
  
  CREATE POLICY "Emergency contacts access policy" ON emergency_contacts
    FOR ALL USING (
      pet_id IN (
        SELECT id FROM pets WHERE owner_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      )
    );
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Safely drop and recreate policies for symptoms
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable all access for users based on pet ownership" ON symptoms;
  
  CREATE POLICY "Symptoms access policy" ON symptoms
    FOR ALL USING (
      pet_id IN (
        SELECT id FROM pets WHERE owner_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      )
    );
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Safely drop and recreate policies for nutrition_plans
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable all access for users based on pet ownership" ON nutrition_plans;
  
  CREATE POLICY "Nutrition plans access policy" ON nutrition_plans
    FOR ALL USING (
      pet_id IN (
        SELECT id FROM pets WHERE owner_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      )
    );
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Safely drop and recreate policies for meals
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable all access for users based on nutrition plan ownership" ON meals;
  
  CREATE POLICY "Meals access policy" ON meals
    FOR ALL USING (
      plan_id IN (
        SELECT id FROM nutrition_plans WHERE pet_id IN (
          SELECT id FROM pets WHERE owner_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
          )
        )
      )
    );
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Safely drop and recreate policies for behavior_analyses
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable all access for users based on pet ownership" ON behavior_analyses;
  
  CREATE POLICY "Behavior analyses access policy" ON behavior_analyses
    FOR ALL USING (
      pet_id IN (
        SELECT id FROM pets WHERE owner_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      )
    );
EXCEPTION WHEN OTHERS THEN NULL;
END $$;