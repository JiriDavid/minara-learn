-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (for users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'student',
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  thumbnail TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  instructor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category TEXT,
  level TEXT,
  duration INTEGER,
  total_lessons INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  num_reviews INTEGER DEFAULT 0,
  num_students INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Public access for viewing published courses
CREATE POLICY "Published courses are viewable by everyone" 
ON courses FOR SELECT USING (is_published = true);

-- Instructors can manage their own courses
CREATE POLICY "Instructors can manage their own courses" 
ON courses FOR ALL USING (auth.uid() = instructor_id);

-- Admins can manage all courses
CREATE POLICY "Admins can manage all courses" 
ON courses FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Sections table
CREATE TABLE IF NOT EXISTS sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on sections
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- Public access for viewing sections of published courses
CREATE POLICY "Sections of published courses are viewable by everyone" 
ON sections FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE id = sections.course_id AND is_published = true
  )
);

-- Instructors can manage sections of their own courses
CREATE POLICY "Instructors can manage sections of their own courses" 
ON sections FOR ALL USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE id = sections.course_id AND instructor_id = auth.uid()
  )
);

-- Admins can manage all sections
CREATE POLICY "Admins can manage all sections" 
ON sections FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  duration INTEGER,
  is_free BOOLEAN DEFAULT false,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on lessons
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Public access for viewing free lessons of published courses
CREATE POLICY "Free lessons of published courses are viewable by everyone" 
ON lessons FOR SELECT USING (
  lessons.is_free = true AND EXISTS (
    SELECT 1 FROM sections 
    JOIN courses ON sections.course_id = courses.id
    WHERE sections.id = lessons.section_id AND courses.is_published = true
  )
);

-- Instructors can manage lessons of their own courses
CREATE POLICY "Instructors can manage lessons of their own courses" 
ON lessons FOR ALL USING (
  EXISTS (
    SELECT 1 FROM sections 
    JOIN courses ON sections.course_id = courses.id
    WHERE sections.id = lessons.section_id AND courses.instructor_id = auth.uid()
  )
);

-- Enrolled students can view all lessons of their enrolled courses
CREATE POLICY "Enrolled students can view lessons of their enrolled courses" 
ON lessons FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM enrollments
    JOIN sections ON sections.course_id = enrollments.course_id
    WHERE sections.id = lessons.section_id 
    AND enrollments.user_id = auth.uid()
    AND enrollments.status = 'active'
  )
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  progress DECIMAL(5, 2) DEFAULT 0,
  completed_lessons JSONB DEFAULT '[]'::jsonb,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS on enrollments
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Users can view their own enrollments
CREATE POLICY "Users can view their own enrollments" 
ON enrollments FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own enrollments
CREATE POLICY "Users can create their own enrollments" 
ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own enrollments
CREATE POLICY "Users can update their own enrollments" 
ON enrollments FOR UPDATE USING (auth.uid() = user_id);

-- Course instructors can view enrollments for their courses
CREATE POLICY "Instructors can view enrollments for their courses" 
ON enrollments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE id = enrollments.course_id AND instructor_id = auth.uid()
  )
);

-- Admins can manage all enrollments
CREATE POLICY "Admins can manage all enrollments" 
ON enrollments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS on reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public access for viewing reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON reviews FOR SELECT USING (true);

-- Users can create their own reviews
CREATE POLICY "Users can create their own reviews" 
ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews" 
ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews" 
ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Admins can manage all reviews
CREATE POLICY "Admins can manage all reviews" 
ON reviews FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE,
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS on certificates
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Users can view their own certificates
CREATE POLICY "Users can view their own certificates" 
ON certificates FOR SELECT USING (auth.uid() = user_id);

-- Admins can manage all certificates
CREATE POLICY "Admins can manage all certificates" 
ON certificates FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Function to update course ratings
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses
  SET 
    average_rating = (
      SELECT AVG(rating)::numeric(3,2)
      FROM reviews
      WHERE course_id = NEW.course_id
    ),
    num_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE course_id = NEW.course_id
    )
  WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update course ratings when reviews change
CREATE TRIGGER update_course_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_course_rating(); 