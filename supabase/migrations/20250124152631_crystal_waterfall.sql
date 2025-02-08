/*
  # Add health metrics table

  1. New Tables
    - `health_metrics`
      - `id` (uuid, primary key)
      - `pet_id` (uuid, foreign key to pets)
      - `date` (date)
      - `weight` (decimal)
      - `height` (decimal)
      - `temperature` (decimal)
      - `heart_rate` (integer)
      - `activity_level` (text)
      - `notes` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `health_metrics` table
    - Add policy for authenticated users to manage their pets' health metrics
*/

-- Create health_metrics table
CREATE TABLE IF NOT EXISTS health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES pets NOT NULL,
  date date NOT NULL,
  weight decimal,
  height decimal,
  temperature decimal,
  heart_rate integer,
  activity_level text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;

-- Create policy for health metrics management
CREATE POLICY "Health metrics access policy"
  ON health_metrics
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