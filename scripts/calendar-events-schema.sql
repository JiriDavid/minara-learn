-- Calendar Events Schema for Lecturer Scheduling System
-- This script creates the calendar_events table for storing lecturer events and schedules

-- Create calendar_events table
CREATE TABLE calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instructor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    event_type VARCHAR(50) DEFAULT 'general' CHECK (event_type IN ('lecture', 'office_hours', 'meeting', 'exam', 'general')),
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    location VARCHAR(255),
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

-- Create indexes for better performance
CREATE INDEX idx_calendar_events_instructor_id ON calendar_events(instructor_id);
CREATE INDEX idx_calendar_events_course_id ON calendar_events(course_id);
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_calendar_events_end_time ON calendar_events(end_time);
CREATE INDEX idx_calendar_events_event_type ON calendar_events(event_type);
CREATE INDEX idx_calendar_events_status ON calendar_events(status);

-- Create a composite index for time range queries
CREATE INDEX idx_calendar_events_time_range ON calendar_events(instructor_id, start_time, end_time);

-- Create event_attendees table for tracking attendees
CREATE TABLE event_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'no_show', 'cancelled')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    attended_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Create indexes for event_attendees
CREATE INDEX idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX idx_event_attendees_user_id ON event_attendees(user_id);
CREATE INDEX idx_event_attendees_status ON event_attendees(status);

-- Create function to update attendee_count automatically
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

-- Create trigger to automatically update attendee count
CREATE TRIGGER trigger_update_event_attendee_count
    AFTER INSERT OR UPDATE OR DELETE ON event_attendees
    FOR EACH ROW EXECUTE FUNCTION update_event_attendee_count();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER trigger_calendar_events_updated_at
    BEFORE UPDATE ON calendar_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_event_attendees_updated_at
    BEFORE UPDATE ON event_attendees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies for security
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- Calendar events policies
CREATE POLICY "Instructors can view their own events" ON calendar_events
    FOR SELECT USING (
        auth.uid() = instructor_id OR 
        is_public = true OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Instructors can create their own events" ON calendar_events
    FOR INSERT WITH CHECK (
        auth.uid() = instructor_id AND
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('instructor', 'admin')
        )
    );

CREATE POLICY "Instructors can update their own events" ON calendar_events
    FOR UPDATE USING (
        auth.uid() = instructor_id OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Instructors can delete their own events" ON calendar_events
    FOR DELETE USING (
        auth.uid() = instructor_id OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Event attendees policies
CREATE POLICY "Users can view attendee records for events they can see" ON event_attendees
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM calendar_events 
            WHERE id = event_attendees.event_id 
            AND instructor_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Users can register for events" ON event_attendees
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM calendar_events 
            WHERE id = event_attendees.event_id 
            AND (is_public = true OR instructor_id = auth.uid())
            AND status = 'scheduled'
            AND start_time > NOW()
            AND (max_attendees IS NULL OR attendee_count < max_attendees)
        )
    );

CREATE POLICY "Users can update their own registrations" ON event_attendees
    FOR UPDATE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM calendar_events 
            WHERE id = event_attendees.event_id 
            AND instructor_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Users can cancel their registrations" ON event_attendees
    FOR DELETE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM calendar_events 
            WHERE id = event_attendees.event_id 
            AND instructor_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Insert some sample events for testing
INSERT INTO calendar_events (
    instructor_id, 
    title, 
    description, 
    start_time, 
    end_time, 
    event_type, 
    location, 
    is_public, 
    color
) 
SELECT 
    p.id,
    'Office Hours - ' || COALESCE(p.name, 'Instructor'),
    'Weekly office hours for student consultations and questions',
    DATE_TRUNC('week', NOW()) + INTERVAL '2 days 14 hours', -- Wednesday 2 PM
    DATE_TRUNC('week', NOW()) + INTERVAL '2 days 16 hours', -- Wednesday 4 PM
    'office_hours',
    'Room 201',
    true,
    '#10b981'
FROM profiles p 
WHERE p.role = 'instructor' 
LIMIT 3;

INSERT INTO calendar_events (
    instructor_id, 
    title, 
    description, 
    start_time, 
    end_time, 
    event_type, 
    course_id,
    location, 
    is_public, 
    color,
    max_attendees
) 
SELECT 
    c.instructor_id,
    'Lecture: ' || c.title,
    'Regular lecture session for ' || c.title,
    DATE_TRUNC('week', NOW()) + INTERVAL '1 day 10 hours', -- Tuesday 10 AM
    DATE_TRUNC('week', NOW()) + INTERVAL '1 day 12 hours', -- Tuesday 12 PM
    'lecture',
    c.id,
    'Main Auditorium',
    true,
    '#3b82f6',
    100
FROM courses c 
WHERE c.instructor_id IS NOT NULL 
LIMIT 5;

-- Create helpful views for common queries
CREATE VIEW lecturer_schedule AS
SELECT 
    ce.*,
    c.title as course_title,
    p.name as instructor_name,
    p.email as instructor_email
FROM calendar_events ce
LEFT JOIN courses c ON ce.course_id = c.id
LEFT JOIN profiles p ON ce.instructor_id = p.id;

CREATE VIEW upcoming_events AS
SELECT 
    ce.*,
    c.title as course_title,
    p.name as instructor_name
FROM calendar_events ce
LEFT JOIN courses c ON ce.course_id = c.id
LEFT JOIN profiles p ON ce.instructor_id = p.id
WHERE ce.start_time > NOW() 
AND ce.status = 'scheduled'
ORDER BY ce.start_time;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON calendar_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON event_attendees TO authenticated;
GRANT SELECT ON lecturer_schedule TO authenticated;
GRANT SELECT ON upcoming_events TO authenticated;

-- Comments for documentation
COMMENT ON TABLE calendar_events IS 'Stores calendar events and schedules for instructors';
COMMENT ON TABLE event_attendees IS 'Tracks attendees for calendar events';
COMMENT ON COLUMN calendar_events.recurrence_pattern IS 'JSON object storing recurrence rules (frequency, interval, days, etc.)';
COMMENT ON COLUMN calendar_events.metadata IS 'Additional event metadata as JSON';
COMMENT ON COLUMN calendar_events.color IS 'Hex color code for calendar display';
