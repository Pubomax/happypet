/*
  # Add Health Metrics to Pets Table

  1. Changes
    - Add health metrics columns to pets table:
      - height (decimal): Pet's height in inches
      - temperature (decimal): Body temperature in Fahrenheit
      - heart_rate (integer): Heart rate in beats per minute
      - activity_level (text): Daily activity level description
    
  2. Notes
    - All new columns are nullable to support gradual data collection
    - Using appropriate data types for each metric
    - No data loss as these are new columns
*/

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