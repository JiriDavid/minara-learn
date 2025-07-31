-- Updated instructor applications table to match current form fields
-- Drop the existing table if it exists (for development only)
DROP TABLE IF EXISTS instructor_applications CASCADE;

-- Create instructor applications table with correct fields
CREATE TABLE instructor_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
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

-- Enable RLS on instructor_applications
ALTER TABLE instructor_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view their own applications" 
ON instructor_applications FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Users can insert their own applications
CREATE POLICY "Users can insert their own applications" 
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

-- Admins can update all applications
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

-- Create indexes for better performance
CREATE INDEX idx_instructor_applications_user_id ON instructor_applications(user_id);
CREATE INDEX idx_instructor_applications_status ON instructor_applications(status);
CREATE INDEX idx_instructor_applications_submitted_at ON instructor_applications(submitted_at);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_instructor_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_instructor_applications_updated_at
  BEFORE UPDATE ON instructor_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_instructor_applications_updated_at();

-- Function to notify admins when a new application is submitted
CREATE OR REPLACE FUNCTION notify_admin_new_application()
RETURNS TRIGGER AS $$
BEGIN
  -- Here you could implement email notifications or other notification logic
  -- For now, we'll just log the event
  RAISE NOTICE 'New instructor application submitted: %', NEW.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to notify admins of new applications
CREATE TRIGGER notify_admin_new_application
  AFTER INSERT ON instructor_applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_new_application();
