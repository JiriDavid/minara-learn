-- Fix instructor signup role constraint
-- The profiles table constraint needs to allow 'instructor_pending' role

-- Drop the existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add the updated constraint that includes instructor_pending
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('student', 'instructor', 'instructor_pending', 'admin'));

-- Update the existing user who was incorrectly set to student
UPDATE profiles 
SET role = 'instructor_pending' 
WHERE id = '618ffbf1-d99a-4897-9f4f-270368a8278d';

-- Verify the update
SELECT id, email, role, created_at 
FROM profiles 
WHERE id = '618ffbf1-d99a-4897-9f4f-270368a8278d';
