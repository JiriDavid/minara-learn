-- ===============================================
-- FIX INSTRUCTOR APPLICATIONS RLS POLICIES
-- ===============================================
-- Run this script in your Supabase SQL Editor to fix RLS policy issues
-- This resolves the "new row violates row-level security policy" error

-- First, drop ALL existing policies on instructor_applications
DROP POLICY IF EXISTS "Users can view own applications" ON instructor_applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON instructor_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON instructor_applications;
DROP POLICY IF EXISTS "Users can insert their own applications" ON instructor_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON instructor_applications;
DROP POLICY IF EXISTS "Admins can update all applications" ON instructor_applications;
DROP POLICY IF EXISTS "instructor_applications_select_own" ON instructor_applications;
DROP POLICY IF EXISTS "instructor_applications_insert_own" ON instructor_applications;
DROP POLICY IF EXISTS "instructor_applications_admin_all" ON instructor_applications;

-- Disable RLS temporarily to ensure we can create policies
ALTER TABLE instructor_applications DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE instructor_applications ENABLE ROW LEVEL SECURITY;

-- Create simple, working RLS policies
-- Policy 1: Allow authenticated users to SELECT their own applications
CREATE POLICY "select_own_applications" 
ON instructor_applications FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Policy 2: Allow authenticated users to INSERT their own applications
CREATE POLICY "insert_own_applications" 
ON instructor_applications FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Allow authenticated users to UPDATE their own applications (if needed)
CREATE POLICY "update_own_applications" 
ON instructor_applications FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Allow admins to do everything
CREATE POLICY "admin_full_access" 
ON instructor_applications FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'instructor_applications'
ORDER BY policyname;
