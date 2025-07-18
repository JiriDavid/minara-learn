-- Create instructor applications table
CREATE TABLE IF NOT EXISTS instructor_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT NOT NULL,
  expertise TEXT NOT NULL,
  experience TEXT NOT NULL,
  education TEXT NOT NULL,
  certifications TEXT,
  proposed_courses TEXT NOT NULL,
  teaching_philosophy TEXT NOT NULL,
  phone TEXT,
  linkedin TEXT,
  website TEXT,
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
USING (auth.uid() = user_id);

-- Users can create their own applications
CREATE POLICY "Users can create their own applications" 
ON instructor_applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications" 
ON instructor_applications FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins can update all applications
CREATE POLICY "Admins can update all applications" 
ON instructor_applications FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create index for performance
CREATE INDEX idx_instructor_applications_user_id ON instructor_applications(user_id);
CREATE INDEX idx_instructor_applications_status ON instructor_applications(status);

-- Add approval status to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instructor_status TEXT DEFAULT 'none' CHECK (instructor_status IN ('none', 'pending', 'approved', 'rejected'));

-- Function to update profile when application is approved
CREATE OR REPLACE FUNCTION update_instructor_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile when application status changes
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE profiles 
    SET role = 'instructor', instructor_status = 'approved', updated_at = NOW()
    WHERE id = NEW.user_id;
  ELSIF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    UPDATE profiles 
    SET instructor_status = 'rejected', updated_at = NOW()
    WHERE id = NEW.user_id;
  ELSIF NEW.status = 'pending' AND OLD.status != 'pending' THEN
    UPDATE profiles 
    SET instructor_status = 'pending', updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_instructor_application_status_change
  AFTER UPDATE ON instructor_applications
  FOR EACH ROW EXECUTE FUNCTION update_instructor_status();

-- Create notification function for new applications
CREATE OR REPLACE FUNCTION notify_new_instructor_application()
RETURNS TRIGGER AS $$
BEGIN
  -- You can implement email notification logic here
  -- For now, just log the application
  RAISE LOG 'New instructor application submitted: %', NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new applications
CREATE TRIGGER on_new_instructor_application
  AFTER INSERT ON instructor_applications
  FOR EACH ROW EXECUTE FUNCTION notify_new_instructor_application();
