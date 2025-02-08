/*
  # Add veterinary clinic integration tables

  1. New Tables
    - `vet_clinics`: Stores clinic information and integration details
    - `clinic_services`: Available services at each clinic
    - `clinic_availability`: Available appointment slots for manual integrations
    - Add integration fields to appointments table

  2. Security
    - Enable RLS on all new tables
    - Add appropriate access policies
*/

-- Create vet_clinics table
CREATE TABLE IF NOT EXISTS vet_clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  website text,
  integration_type text NOT NULL,
  integration_id text,
  business_hours jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Create clinic_services table
CREATE TABLE IF NOT EXISTS clinic_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES vet_clinics NOT NULL,
  name text NOT NULL,
  duration integer NOT NULL,
  description text,
  price decimal NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create clinic_availability table for manual integrations
CREATE TABLE IF NOT EXISTS clinic_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES vet_clinics NOT NULL,
  service_id uuid REFERENCES clinic_services NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  veterinarian_id uuid,
  veterinarian_name text,
  status text NOT NULL DEFAULT 'available',
  created_at timestamptz DEFAULT now()
);

-- Add integration fields to appointments table
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS clinic_id uuid REFERENCES vet_clinics,
ADD COLUMN IF NOT EXISTS service_id uuid REFERENCES clinic_services,
ADD COLUMN IF NOT EXISTS integration_appointment_id text;

-- Enable RLS
ALTER TABLE vet_clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_availability ENABLE ROW LEVEL SECURITY;

-- Create policies for vet_clinics
CREATE POLICY "Public read access to active clinics"
  ON vet_clinics
  FOR SELECT
  USING (status = 'active');

-- Create policies for clinic_services
CREATE POLICY "Public read access to clinic services"
  ON clinic_services
  FOR SELECT
  USING (
    clinic_id IN (
      SELECT id FROM vet_clinics WHERE status = 'active'
    )
  );

-- Create policies for clinic_availability
CREATE POLICY "Public read access to available slots"
  ON clinic_availability
  FOR SELECT
  USING (
    status = 'available' AND
    clinic_id IN (
      SELECT id FROM vet_clinics WHERE status = 'active'
    )
  );