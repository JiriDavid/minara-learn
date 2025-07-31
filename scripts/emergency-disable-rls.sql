-- ===============================================
-- EMERGENCY FIX: DISABLE RLS TEMPORARILY
-- ===============================================
-- Run this in your Supabase SQL Editor to temporarily fix the issue
-- This will allow instructor applications to work while we debug the RLS policies

-- Step 1: Temporarily disable RLS on instructor_applications table
ALTER TABLE instructor_applications DISABLE ROW LEVEL SECURITY;

-- Step 2: Verify the table structure and current policies
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'instructor_applications' 
ORDER BY ordinal_position;

-- Step 3: Check existing policies (even though RLS is disabled)
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'instructor_applications';

-- Step 4: Test if the table accepts basic inserts now
-- (This is just a structure test - don't worry about the fake data)
-- INSERT INTO instructor_applications (
--     user_id, name, email, expertise, experience, bio, motivation
-- ) VALUES (
--     '00000000-0000-0000-0000-000000000000',
--     'Test Name',
--     'test@example.com', 
--     'Test Expertise',
--     'Test Experience',
--     'Test Bio',
--     'Test Motivation'
-- );

-- Step 5: Clean up test data (uncomment if you ran the insert above)
-- DELETE FROM instructor_applications WHERE email = 'test@example.com';

-- ===============================================
-- NEXT STEPS AFTER RUNNING THIS:
-- ===============================================
-- 1. Try submitting an instructor application - it should work now
-- 2. Once confirmed working, we can re-enable RLS with proper policies
-- 3. Test the application submission thoroughly
-- 4. Report back if it works or if there are other issues
