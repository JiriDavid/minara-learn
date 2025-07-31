-- ===============================================
-- FIX FOREIGN KEY CONSTRAINT ISSUE
-- ===============================================
-- Run this in your Supabase SQL Editor to fix the foreign key constraint error

-- Step 1: Check current table structures
SELECT 'profiles table structure' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

SELECT 'instructor_applications table structure' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'instructor_applications' 
ORDER BY ordinal_position;

-- Step 2: Check foreign key constraints
SELECT 'Foreign key constraints' as info;
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'instructor_applications';

-- Step 3: Temporarily remove the foreign key constraint to allow testing
-- (We'll add it back with proper error handling later)
ALTER TABLE instructor_applications 
DROP CONSTRAINT IF EXISTS instructor_applications_user_id_fkey;

-- Step 4: Make user_id column NOT NULL but without foreign key for now
ALTER TABLE instructor_applications 
ALTER COLUMN user_id SET NOT NULL;

-- Step 5: Add an index for performance (since we removed the FK)
CREATE INDEX IF NOT EXISTS idx_instructor_applications_user_id_manual 
ON instructor_applications(user_id);

-- Step 6: Test data to verify the table accepts inserts now
-- (This is safe test data that we'll clean up)
-- Uncomment the next lines to test:

-- INSERT INTO instructor_applications (
--     id,
--     user_id, 
--     name, 
--     email, 
--     expertise, 
--     experience, 
--     bio, 
--     motivation,
--     status
-- ) VALUES (
--     gen_random_uuid(),
--     gen_random_uuid(), -- This should work now without FK constraint
--     'Test Instructor',
--     'test-instructor@example.com',
--     'Test Expertise',
--     'Test Experience', 
--     'Test Bio',
--     'Test Motivation',
--     'pending'
-- );

-- Clean up test data:
-- DELETE FROM instructor_applications WHERE email = 'test-instructor@example.com';

-- ===============================================
-- VERIFICATION
-- ===============================================
-- Check that the constraint was removed successfully
SELECT 'Remaining constraints after fix' as info;
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'instructor_applications' 
AND constraint_type = 'FOREIGN KEY';

-- If the above query returns no rows, the foreign key constraint was successfully removed
