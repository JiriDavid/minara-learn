-- ===============================================
-- FIX PROFILES TABLE ISSUES
-- ===============================================
-- Run this in your Supabase SQL Editor to fix profile creation issues

-- Step 1: Check if profiles table exists and its structure
SELECT 'Profiles table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Step 2: Check RLS status
SELECT 'RLS Status:' as info;
SELECT schemaname, tablename, rowsecurity, rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'profiles';

-- Step 3: Fix common issues with profiles table

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'instructor_pending', 'admin')),
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Ensure RLS is properly configured
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop conflicting policies and create simple ones
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

-- Step 6: Create working RLS policies
CREATE POLICY "profiles_select_all" 
ON profiles FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "profiles_insert_own" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Step 7: Create function to handle profile creation automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Step 8: Create trigger to automatically create profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Step 9: Test insert (uncomment to test)
-- INSERT INTO profiles (id, email, full_name, role) VALUES 
-- (gen_random_uuid(), 'test-profile@example.com', 'Test Profile User', 'student');

-- Clean up test data:
-- DELETE FROM profiles WHERE email = 'test-profile@example.com';

-- Step 10: Verify policies were created
SELECT 'Final policies on profiles table:' as info;
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;
