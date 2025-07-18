-- Migration to add missing full_name column and fix database schema

-- Add full_name column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

-- If the table has 'name' column instead, we need to migrate the data
DO $$
BEGIN
    -- Check if 'name' column exists and full_name doesn't have data
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='profiles' AND column_name='name') THEN
        -- Migrate data from 'name' to 'full_name' if full_name is empty
        UPDATE profiles 
        SET full_name = name 
        WHERE full_name IS NULL AND name IS NOT NULL;
        
        -- Then drop the old 'name' column
        ALTER TABLE profiles DROP COLUMN IF EXISTS name;
    END IF;
END $$;

-- Ensure the role column has the correct constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('student', 'instructor', 'admin'));

-- Update any existing 'lecturer' roles to 'instructor'
UPDATE profiles SET role = 'instructor' WHERE role = 'lecturer';

-- Make sure we have proper indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
