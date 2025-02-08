/*
  # Add timeline events table

  1. New Tables
    - `timeline_events`
      - `id` (uuid, primary key)
      - `pet_id` (uuid, foreign key to pets)
      - `event_type` (text)
      - `title` (text)
      - `description` (text)
      - `date` (date)
      - `tags` (text array)
      - `media_url` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `timeline_events` table
    - Add policy for authenticated users to manage their pets' timeline events
*/

-- Create timeline_events table
CREATE TABLE IF NOT EXISTS timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES pets NOT NULL,
  event_type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  tags text[] DEFAULT '{}',
  media_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Create policy for timeline events management
CREATE POLICY "Users can manage their pets' timeline events"
  ON timeline_events
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