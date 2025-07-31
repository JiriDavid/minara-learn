-- ===============================================
-- MISSING TABLES SETUP FOR MINARA LEARN
-- ===============================================
-- Run this script in your Supabase SQL Editor
-- This creates tables that your application references but are currently missing

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================================
-- 1. ASSIGNMENTS TABLE
-- ===============================================
-- Referenced in models/Assignment.js and various API routes
CREATE TABLE IF NOT EXISTS assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    total_points INTEGER DEFAULT 100,
    passing_score INTEGER DEFAULT 70,
    resources JSONB DEFAULT '[]'::jsonb, -- Array of {title, url, type}
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 2. ASSIGNMENT SUBMISSIONS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT,
    file_urls JSONB DEFAULT '[]'::jsonb, -- Array of file URLs
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    grade INTEGER, -- Score out of total_points
    feedback TEXT,
    graded_by UUID REFERENCES profiles(id),
    graded_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'graded', 'returned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assignment_id, user_id)
);

-- ===============================================
-- 3. QUIZZES TABLE
-- ===============================================
-- Referenced in models/Quiz.js
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    description TEXT,
    passing_score INTEGER DEFAULT 70,
    time_limit INTEGER DEFAULT 0, -- in minutes, 0 means no limit
    questions JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of question objects
    is_published BOOLEAN DEFAULT false,
    attempts_allowed INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 4. QUIZ ATTEMPTS TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb, -- User's answers
    score INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    time_taken INTEGER, -- in seconds
    is_passed BOOLEAN DEFAULT false,
    attempt_number INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 5. DISCUSSIONS TABLE
-- ===============================================
-- Referenced in models/Discussion.js
CREATE TABLE IF NOT EXISTS discussions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    is_pinned BOOLEAN DEFAULT false,
    reply_count INTEGER DEFAULT 0,
    last_reply_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 6. DISCUSSION REPLIES TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS discussion_replies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    parent_reply_id UUID REFERENCES discussion_replies(id) ON DELETE CASCADE, -- For nested replies
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 7. NOTIFICATIONS TABLE
-- ===============================================
-- Referenced in student dashboard and various features
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'course', 'assignment', 'quiz', 'discussion', 'system', 'instructor_application')),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT, -- URL to navigate when notification is clicked
    related_id UUID, -- ID of related entity (course_id, assignment_id, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 8. CALENDAR EVENTS TABLE
-- ===============================================
-- Referenced in instructor calendar API
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    event_type VARCHAR(50) DEFAULT 'general' CHECK (event_type IN ('lecture', 'office_hours', 'meeting', 'exam', 'general')),
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    location VARCHAR(255),
    meeting_url TEXT,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSONB, -- Store recurrence rules as JSON
    max_attendees INTEGER,
    attendee_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed', 'rescheduled')),
    is_public BOOLEAN DEFAULT false,
    color VARCHAR(7) DEFAULT '#3b82f6', -- Hex color for calendar display
    metadata JSONB, -- Additional event metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 9. EVENT ATTENDEES TABLE
-- ===============================================
CREATE TABLE IF NOT EXISTS event_attendees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES calendar_events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'no_show', 'cancelled')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    attended_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- ===============================================
-- 10. LESSON PROGRESS TABLE (Enhanced Completions)
-- ===============================================
-- More detailed tracking than what's in completions table
CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    time_spent INTEGER DEFAULT 0, -- in seconds
    last_position INTEGER DEFAULT 0, -- for video lessons, last watched position
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- ===============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ===============================================

-- Assignments indexes
CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_lesson_id ON assignments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);

-- Assignment submissions indexes
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_user_id ON assignment_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_status ON assignment_submissions(status);

-- Quizzes indexes
CREATE INDEX IF NOT EXISTS idx_quizzes_course_id ON quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_lesson_id ON quizzes(lesson_id);

-- Quiz attempts indexes
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);

-- Discussions indexes
CREATE INDEX IF NOT EXISTS idx_discussions_course_id ON discussions(course_id);
CREATE INDEX IF NOT EXISTS idx_discussions_lesson_id ON discussions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_discussions_user_id ON discussions(user_id);
CREATE INDEX IF NOT EXISTS idx_discussions_is_pinned ON discussions(is_pinned);

-- Discussion replies indexes
CREATE INDEX IF NOT EXISTS idx_discussion_replies_discussion_id ON discussion_replies(discussion_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_user_id ON discussion_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_parent_id ON discussion_replies(parent_reply_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Calendar events indexes
CREATE INDEX IF NOT EXISTS idx_calendar_events_instructor_id ON calendar_events(instructor_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_course_id ON calendar_events(course_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_event_type ON calendar_events(event_type);
CREATE INDEX IF NOT EXISTS idx_calendar_events_status ON calendar_events(status);

-- Event attendees indexes
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON event_attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_status ON event_attendees(status);

-- Lesson progress indexes
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_course_id ON lesson_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_completed ON lesson_progress(is_completed);

-- ===============================================
-- ENABLE ROW LEVEL SECURITY
-- ===============================================

-- Enable RLS on all tables
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- ===============================================
-- CREATE RLS POLICIES
-- ===============================================

-- ASSIGNMENTS POLICIES
CREATE POLICY "Students can view published assignments for enrolled courses" ON assignments
    FOR SELECT USING (
        is_published = true AND EXISTS (
            SELECT 1 FROM enrollments 
            WHERE enrollments.course_id = assignments.course_id 
            AND enrollments.user_id = auth.uid()
            AND enrollments.status = 'active'
        )
    );

CREATE POLICY "Instructors can manage assignments for their courses" ON assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM courses 
            WHERE courses.id = assignments.course_id 
            AND courses.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all assignments" ON assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- ASSIGNMENT SUBMISSIONS POLICIES
CREATE POLICY "Students can manage their own submissions" ON assignment_submissions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view submissions for their course assignments" ON assignment_submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM assignments 
            JOIN courses ON assignments.course_id = courses.id
            WHERE assignments.id = assignment_submissions.assignment_id 
            AND courses.instructor_id = auth.uid()
        )
    );

-- QUIZZES POLICIES
CREATE POLICY "Students can view published quizzes for enrolled courses" ON quizzes
    FOR SELECT USING (
        is_published = true AND EXISTS (
            SELECT 1 FROM enrollments 
            WHERE enrollments.course_id = quizzes.course_id 
            AND enrollments.user_id = auth.uid()
            AND enrollments.status = 'active'
        )
    );

CREATE POLICY "Instructors can manage quizzes for their courses" ON quizzes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM courses 
            WHERE courses.id = quizzes.course_id 
            AND courses.instructor_id = auth.uid()
        )
    );

-- QUIZ ATTEMPTS POLICIES
CREATE POLICY "Students can manage their own quiz attempts" ON quiz_attempts
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view quiz attempts for their courses" ON quiz_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM quizzes 
            JOIN courses ON quizzes.course_id = courses.id
            WHERE quizzes.id = quiz_attempts.quiz_id 
            AND courses.instructor_id = auth.uid()
        )
    );

-- DISCUSSIONS POLICIES
CREATE POLICY "Enrolled students can view course discussions" ON discussions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM enrollments 
            WHERE enrollments.course_id = discussions.course_id 
            AND enrollments.user_id = auth.uid()
            AND enrollments.status = 'active'
        )
    );

CREATE POLICY "Enrolled students can create discussions" ON discussions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND EXISTS (
            SELECT 1 FROM enrollments 
            WHERE enrollments.course_id = discussions.course_id 
            AND enrollments.user_id = auth.uid()
            AND enrollments.status = 'active'
        )
    );

CREATE POLICY "Users can update their own discussions" ON discussions
    FOR UPDATE USING (auth.uid() = user_id);

-- DISCUSSION REPLIES POLICIES
CREATE POLICY "Users can view replies for accessible discussions" ON discussion_replies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM discussions 
            JOIN enrollments ON discussions.course_id = enrollments.course_id
            WHERE discussions.id = discussion_replies.discussion_id 
            AND enrollments.user_id = auth.uid()
            AND enrollments.status = 'active'
        )
    );

CREATE POLICY "Users can create replies to accessible discussions" ON discussion_replies
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND EXISTS (
            SELECT 1 FROM discussions 
            JOIN enrollments ON discussions.course_id = enrollments.course_id
            WHERE discussions.id = discussion_replies.discussion_id 
            AND enrollments.user_id = auth.uid()
            AND enrollments.status = 'active'
        )
    );

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- CALENDAR EVENTS POLICIES
CREATE POLICY "Instructors can manage their own events" ON calendar_events
    FOR ALL USING (auth.uid() = instructor_id);

CREATE POLICY "Students can view public events and events for enrolled courses" ON calendar_events
    FOR SELECT USING (
        is_public = true OR EXISTS (
            SELECT 1 FROM enrollments 
            WHERE enrollments.course_id = calendar_events.course_id 
            AND enrollments.user_id = auth.uid()
            AND enrollments.status = 'active'
        )
    );

-- EVENT ATTENDEES POLICIES
CREATE POLICY "Users can manage their own attendance" ON event_attendees
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Event owners can view all attendees" ON event_attendees
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM calendar_events 
            WHERE calendar_events.id = event_attendees.event_id 
            AND calendar_events.instructor_id = auth.uid()
        )
    );

-- LESSON PROGRESS POLICIES
CREATE POLICY "Students can manage their own progress" ON lesson_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view progress for their courses" ON lesson_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM courses 
            WHERE courses.id = lesson_progress.course_id 
            AND courses.instructor_id = auth.uid()
        )
    );

-- ===============================================
-- CREATE FUNCTIONS AND TRIGGERS
-- ===============================================

-- Function to update discussion reply count
CREATE OR REPLACE FUNCTION update_discussion_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE discussions 
        SET reply_count = reply_count + 1,
            last_reply_at = NEW.created_at
        WHERE id = NEW.discussion_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE discussions 
        SET reply_count = GREATEST(0, reply_count - 1)
        WHERE id = OLD.discussion_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for discussion reply count
CREATE TRIGGER trigger_update_discussion_reply_count
    AFTER INSERT OR DELETE ON discussion_replies
    FOR EACH ROW EXECUTE FUNCTION update_discussion_reply_count();

-- Function to update event attendee count
CREATE OR REPLACE FUNCTION update_event_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE calendar_events 
        SET attendee_count = (
            SELECT COUNT(*) 
            FROM event_attendees 
            WHERE event_id = NEW.event_id 
            AND status IN ('registered', 'attended')
        )
        WHERE id = NEW.event_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE calendar_events 
        SET attendee_count = (
            SELECT COUNT(*) 
            FROM event_attendees 
            WHERE event_id = NEW.event_id 
            AND status IN ('registered', 'attended')
        )
        WHERE id = NEW.event_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE calendar_events 
        SET attendee_count = (
            SELECT COUNT(*) 
            FROM event_attendees 
            WHERE event_id = OLD.event_id 
            AND status IN ('registered', 'attended')
        )
        WHERE id = OLD.event_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for event attendee count
CREATE TRIGGER trigger_update_event_attendee_count
    AFTER INSERT OR UPDATE OR DELETE ON event_attendees
    FOR EACH ROW EXECUTE FUNCTION update_event_attendee_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trigger_assignments_updated_at
    BEFORE UPDATE ON assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_assignment_submissions_updated_at
    BEFORE UPDATE ON assignment_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_quizzes_updated_at
    BEFORE UPDATE ON quizzes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_discussions_updated_at
    BEFORE UPDATE ON discussions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_discussion_replies_updated_at
    BEFORE UPDATE ON discussion_replies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_calendar_events_updated_at
    BEFORE UPDATE ON calendar_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_event_attendees_updated_at
    BEFORE UPDATE ON event_attendees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_lesson_progress_updated_at
    BEFORE UPDATE ON lesson_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- SAMPLE DATA (OPTIONAL - COMMENT OUT IF NOT NEEDED)
-- ===============================================

-- Example notification types
INSERT INTO notifications (user_id, title, message, type, created_at) VALUES
-- These are just examples - replace user_id with actual UUIDs from your profiles table
-- ('actual-user-uuid', 'Welcome to Minara Learn!', 'Complete your profile to get started', 'system', NOW()),
-- ('actual-user-uuid', 'New Course Available', 'Check out the latest Python course', 'course', NOW());

-- ===============================================
-- VERIFICATION QUERIES (RUN AFTER SETUP)
-- ===============================================

-- Uncomment these to verify your tables were created successfully:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
-- SELECT COUNT(*) as assignment_count FROM assignments;
-- SELECT COUNT(*) as quiz_count FROM quizzes;
-- SELECT COUNT(*) as discussion_count FROM discussions;
-- SELECT COUNT(*) as notification_count FROM notifications;
-- SELECT COUNT(*) as calendar_event_count FROM calendar_events;

-- ===============================================
-- SETUP COMPLETE
-- ===============================================
-- Your database now has all the missing tables needed for:
-- ✅ Assignments and submissions
-- ✅ Quizzes and attempts  
-- ✅ Discussions and replies
-- ✅ Notifications system
-- ✅ Calendar events and attendees
-- ✅ Enhanced lesson progress tracking
-- ✅ Proper RLS policies for security
-- ✅ Performance indexes
-- ✅ Automatic triggers for data consistency
