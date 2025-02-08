/*
  # Add appointments table

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `pet_id` (uuid, foreign key to pets)
      - `title` (text)
      - `type` (text)
      - `date` (date)
      - `time` (text)
      - `duration` (integer)
      - `notes` (text)
      - `reminder` (boolean)
      - `status` (text)
      - `vet_name` (text)
      - `clinic_name` (text)
      - `clinic_address` (text)
      - `clinic_phone` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `appointments` table
    - Add policy for authenticated users to manage their pets' appointments
*/

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES pets NOT NULL,
  title text NOT NULL,
  type text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  duration integer NOT NULL DEFAULT 30,
  notes text,
  reminder boolean DEFAULT true,
  status text NOT NULL DEFAULT 'scheduled',
  vet_name text,
  clinic_name text,
  clinic_address text,
  clinic_phone text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policy for appointment management
CREATE POLICY "Users can manage their pets' appointments"
  ON appointments
  FOR ALL
  USING (
    pet_id IN (
      SELECT id FROM pets 
      WHERE owner_id IN (
        SELECT id FROM profiles 
        WHERE user_id = auth.uid()
      )
    )
  );