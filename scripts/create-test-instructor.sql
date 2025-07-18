-- Test script to create an instructor user for testing
-- This should be run in Supabase SQL Editor

-- First, let's see what users exist
SELECT id, email, role FROM profiles;

-- Create a test instructor user (replace with actual user ID from auth.users)
-- You'll need to run this after creating a user through the signup flow

-- Example: Update an existing user to be an instructor
-- UPDATE profiles 
-- SET role = 'instructor' 
-- WHERE email = 'test@example.com';

-- Check the result
-- SELECT id, email, role FROM profiles WHERE role = 'instructor';
