-- ===============================================
-- INSTRUCTOR APPLICATIONS TABLE SETUP
-- ===============================================
-- Run this script in your Supabase SQL Editor
-- This will create the correct table structure for instructor applications

-- Step 1: Drop existing table if it exists (CAREFUL: This deletes all data)
DROP TABLE IF EXISTS instructor_applications CASCADE;

-- Step 2: Create the table with the correct structure
CREATE TABLE instructor_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  expertise TEXT NOT NULL,
  experience TEXT NOT NULL,
  organization TEXT,
  bio TEXT NOT NULL,
  motivation TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Enable Row Level Security
ALTER TABLE instructor_applications ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policies

-- Users can view their own applications
CREATE POLICY "Users can view own applications" 
ON instructor_applications FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Users can insert their own applications  
CREATE POLICY "Users can insert own applications" 
ON instructor_applications FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications" 
ON instructor_applications FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Admins can update all applications (for approval/rejection)
CREATE POLICY "Admins can update all applications" 
ON instructor_applications FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Step 5: Create indexes for performance
CREATE INDEX idx_instructor_applications_user_id ON instructor_applications(user_id);
CREATE INDEX idx_instructor_applications_status ON instructor_applications(status);
CREATE INDEX idx_instructor_applications_submitted_at ON instructor_applications(submitted_at DESC);
CREATE INDEX idx_instructor_applications_email ON instructor_applications(email);

-- Step 6: Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_instructor_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger for auto-updating updated_at
CREATE TRIGGER update_instructor_applications_updated_at
  BEFORE UPDATE ON instructor_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_instructor_applications_updated_at();

-- Step 8: Verify the table was created correctly
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'instructor_applications' 
ORDER BY ordinal_position;

-- Step 9: Test insert (optional - remove the inserted record after testing)
-- INSERT INTO instructor_applications (
--   user_id, name, email, expertise, experience, bio, motivation
-- ) VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   'Test User',
--   'test@example.com', 
--   'programming',
--   '3-5',
--   'Test bio content',
--   'Test motivation content'
-- );

-- Uncomment the following line to see the test record:
-- SELECT * FROM instructor_applications WHERE email = 'test@example.com';

-- Remember to delete the test record:
-- DELETE FROM instructor_applications WHERE email = 'test@example.com';
