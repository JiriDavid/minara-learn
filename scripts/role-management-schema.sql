-- Update the profiles table to include proper role constraints
-- First, add a check constraint for roles
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('student', 'instructor', 'admin'));

-- Update RLS policies for role-based access
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete any profile" ON profiles;
DROP POLICY IF EXISTS "Instructors can view student profiles" ON profiles;

-- Admins can do everything
CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update all profiles" 
ON profiles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete any profile" 
ON profiles FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Instructors can view student profiles in their courses
CREATE POLICY "Instructors can view student profiles" 
ON profiles FOR SELECT 
USING (
  role = 'student' AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'instructor'
  )
);

-- Add instructor_id constraint to courses table if it doesn't exist
ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_instructor_role_check;
ALTER TABLE courses ADD CONSTRAINT courses_instructor_role_check
CHECK (
  instructor_id IS NULL OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = instructor_id AND role IN ('instructor', 'admin')
  )
);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is instructor
CREATE OR REPLACE FUNCTION is_instructor(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND role IN ('instructor', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is student
CREATE OR REPLACE FUNCTION is_student(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND role = 'student'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
