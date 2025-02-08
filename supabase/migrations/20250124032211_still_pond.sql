/*
  # Initial Schema Setup for HappyPet

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `pets`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references profiles)
      - `name` (text)
      - `species` (text)
      - `breed` (text)
      - `age` (integer)
      - `weight` (decimal)
      - `avatar_url` (text)
      - `cover_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `medical_records`
      - `id` (uuid, primary key)
      - `pet_id` (uuid, references pets)
      - `type` (text)
      - `date` (date)
      - `details` (text)
      - `created_at` (timestamp)

    - `vaccinations`
      - `id` (uuid, primary key)
      - `pet_id` (uuid, references pets)
      - `name` (text)
      - `date` (date)
      - `next_due` (date)
      - `created_at` (timestamp)

    - `medications`
      - `id` (uuid, primary key)
      - `pet_id` (uuid, references pets)
      - `name` (text)
      - `schedule` (text)
      - `next_dose` (date)
      - `remaining` (integer)
      - `created_at` (timestamp)

    - `emergency_contacts`
      - `id` (uuid, primary key)
      - `pet_id` (uuid, references pets)
      - `name` (text)
      - `role` (text)
      - `phone` (text)
      - `created_at` (timestamp)

    - `symptoms`
      - `id` (uuid, primary key)
      - `pet_id` (uuid, references pets)
      - `type` (text)
      - `severity` (text)
      - `date` (date)
      - `resolved` (boolean)
      - `created_at` (timestamp)

    - `nutrition_plans`
      - `id` (uuid, primary key)
      - `pet_id` (uuid, references pets)
      - `daily_calories` (integer)
      - `restrictions` (text[])
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `meals`
      - `id` (uuid, primary key)
      - `plan_id` (uuid, references nutrition_plans)
      - `time` (text)
      - `portion` (text)
      - `type` (text)
      - `created_at` (timestamp)

    - `behavior_analyses`
      - `id` (uuid, primary key)
      - `pet_id` (uuid, references pets)
      - `type` (text)
      - `findings` (text[])
      - `recommendations` (text[])
      - `confidence` (decimal)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Pets table
CREATE TABLE pets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid REFERENCES profiles NOT NULL,
  name text NOT NULL,
  species text NOT NULL,
  breed text,
  age integer,
  weight decimal,
  avatar_url text,
  cover_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Medical records table
CREATE TABLE medical_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id uuid REFERENCES pets NOT NULL,
  type text NOT NULL,
  date date NOT NULL,
  details text,
  created_at timestamptz DEFAULT now()
);

-- Vaccinations table
CREATE TABLE vaccinations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id uuid REFERENCES pets NOT NULL,
  name text NOT NULL,
  date date NOT NULL,
  next_due date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Medications table
CREATE TABLE medications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id uuid REFERENCES pets NOT NULL,
  name text NOT NULL,
  schedule text NOT NULL,
  next_dose date NOT NULL,
  remaining integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Emergency contacts table
CREATE TABLE emergency_contacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id uuid REFERENCES pets NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Symptoms table
CREATE TABLE symptoms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id uuid REFERENCES pets NOT NULL,
  type text NOT NULL,
  severity text NOT NULL,
  date date NOT NULL,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Nutrition plans table
CREATE TABLE nutrition_plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id uuid REFERENCES pets NOT NULL,
  daily_calories integer NOT NULL,
  restrictions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Meals table
CREATE TABLE meals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id uuid REFERENCES nutrition_plans NOT NULL,
  time text NOT NULL,
  portion text NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Behavior analyses table
CREATE TABLE behavior_analyses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id uuid REFERENCES pets NOT NULL,
  type text NOT NULL,
  findings text[] NOT NULL DEFAULT '{}',
  recommendations text[] NOT NULL DEFAULT '{}',
  confidence decimal NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
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

-- Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for pets
CREATE POLICY "Users can view own pets"
  ON pets FOR SELECT
  TO authenticated
  USING (owner_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own pets"
  ON pets FOR INSERT
  TO authenticated
  WITH CHECK (owner_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own pets"
  ON pets FOR UPDATE
  TO authenticated
  USING (owner_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

-- Policies for medical_records
CREATE POLICY "Users can view own pets' medical records"
  ON medical_records FOR SELECT
  TO authenticated
  USING (pet_id IN (
    SELECT id FROM pets WHERE owner_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can insert own pets' medical records"
  ON medical_records FOR INSERT
  TO authenticated
  WITH CHECK (pet_id IN (
    SELECT id FROM pets WHERE owner_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  ));

-- Similar policies for other tables
CREATE POLICY "Users can manage own pets' vaccinations"
  ON vaccinations FOR ALL
  TO authenticated
  USING (pet_id IN (
    SELECT id FROM pets WHERE owner_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can manage own pets' medications"
  ON medications FOR ALL
  TO authenticated
  USING (pet_id IN (
    SELECT id FROM pets WHERE owner_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can manage own pets' emergency contacts"
  ON emergency_contacts FOR ALL
  TO authenticated
  USING (pet_id IN (
    SELECT id FROM pets WHERE owner_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can manage own pets' symptoms"
  ON symptoms FOR ALL
  TO authenticated
  USING (pet_id IN (
    SELECT id FROM pets WHERE owner_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can manage own pets' nutrition plans"
  ON nutrition_plans FOR ALL
  TO authenticated
  USING (pet_id IN (
    SELECT id FROM pets WHERE owner_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can manage own pets' meals"
  ON meals FOR ALL
  TO authenticated
  USING (plan_id IN (
    SELECT id FROM nutrition_plans WHERE pet_id IN (
      SELECT id FROM pets WHERE owner_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  ));

CREATE POLICY "Users can manage own pets' behavior analyses"
  ON behavior_analyses FOR ALL
  TO authenticated
  USING (pet_id IN (
    SELECT id FROM pets WHERE owner_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  ));