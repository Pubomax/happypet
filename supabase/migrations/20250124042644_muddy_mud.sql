/*
  # Fix RLS Policies for Authentication Flow

  1. Changes
    - Add enable row level security to all tables
    - Update profiles policy to allow insert during registration
    - Update pets policy to allow insert during registration
    - Add policies for authenticated users to manage their data
    - Remove admin-only operations

  2. Security
    - Ensure users can only access their own data
    - Prevent unauthorized access to other users' data
    - Allow new user registration flow
*/

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_analyses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view own pets" ON pets;
DROP POLICY IF EXISTS "Users can insert own pets" ON pets;
DROP POLICY IF EXISTS "Users can update own pets" ON pets;

-- Profiles policies
CREATE POLICY "Enable insert for authentication" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable select for authenticated users" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Pets policies
CREATE POLICY "Enable insert for users based on profile" ON pets
  FOR INSERT WITH CHECK (
    owner_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Enable select for users based on profile" ON pets
  FOR SELECT USING (
    owner_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Enable update for users based on profile" ON pets
  FOR UPDATE USING (
    owner_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Medical records policies
CREATE POLICY "Enable all access for users based on pet ownership" ON medical_records
  FOR ALL USING (
    pet_id IN (
      SELECT id FROM pets WHERE owner_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Vaccinations policies
CREATE POLICY "Enable all access for users based on pet ownership" ON vaccinations
  FOR ALL USING (
    pet_id IN (
      SELECT id FROM pets WHERE owner_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Medications policies
CREATE POLICY "Enable all access for users based on pet ownership" ON medications
  FOR ALL USING (
    pet_id IN (
      SELECT id FROM pets WHERE owner_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Emergency contacts policies
CREATE POLICY "Enable all access for users based on pet ownership" ON emergency_contacts
  FOR ALL USING (
    pet_id IN (
      SELECT id FROM pets WHERE owner_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Symptoms policies
CREATE POLICY "Enable all access for users based on pet ownership" ON symptoms
  FOR ALL USING (
    pet_id IN (
      SELECT id FROM pets WHERE owner_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Nutrition plans policies
CREATE POLICY "Enable all access for users based on pet ownership" ON nutrition_plans
  FOR ALL USING (
    pet_id IN (
      SELECT id FROM pets WHERE owner_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Meals policies
CREATE POLICY "Enable all access for users based on nutrition plan ownership" ON meals
  FOR ALL USING (
    plan_id IN (
      SELECT id FROM nutrition_plans WHERE pet_id IN (
        SELECT id FROM pets WHERE owner_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Behavior analyses policies
CREATE POLICY "Enable all access for users based on pet ownership" ON behavior_analyses
  FOR ALL USING (
    pet_id IN (
      SELECT id FROM pets WHERE owner_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );