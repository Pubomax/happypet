/*
  # Add health metrics columns to pets table

  1. Changes
    - Add new columns to pets table for tracking health metrics:
      - height (decimal)
      - temperature (decimal)
      - heart_rate (integer)
      - activity_level (text)

  2. Notes
    - Uses IF NOT EXISTS to prevent errors if columns already exist
    - No policy changes needed as they are already set up
*/

-- Add health metrics columns to pets table
ALTER TABLE pets 
ADD COLUMN IF NOT EXISTS height decimal,
ADD COLUMN IF NOT EXISTS temperature decimal,
ADD COLUMN IF NOT EXISTS heart_rate integer,
ADD COLUMN IF NOT EXISTS activity_level text;