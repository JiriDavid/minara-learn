import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get('month')) || new Date().getMonth() + 1;
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear();

    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is instructor
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'instructor' && profile.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized - Instructor role required' }, { status: 403 });
    }

    // For now, return mock data since we don't have a calendar events table yet
    // In a real implementation, you would query a calendar_events table
    const mockEvents = [
      {
        id: '1',
        title: 'Mathematics Lecture',
        description: 'Algebra fundamentals',
        type: 'lecture',
        course_id: 'course-1',
        date: `${year}-${month.toString().padStart(2, '0')}-15`,
        time: '09:00',
        duration: 90,
        location: 'Room 101',
        meeting_url: null,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Office Hours',
        description: 'Student consultations',
        type: 'office_hours',
        course_id: null,
        date: `${year}-${month.toString().padStart(2, '0')}-20`,
        time: '14:00',
        duration: 120,
        location: 'Office 204',
        meeting_url: null,
        created_at: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Midterm Exam',
        description: 'Mathematics midterm examination',
        type: 'exam',
        course_id: 'course-1',
        date: `${year}-${month.toString().padStart(2, '0')}-25`,
        time: '10:00',
        duration: 180,
        location: 'Hall A',
        meeting_url: null,
        created_at: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockEvents,
    });

  } catch (error) {
    console.error('Error in lecturer calendar API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is instructor
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'instructor' && profile.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized - Instructor role required' }, { status: 403 });
    }

    const eventData = await request.json();

    // Validate required fields
    if (!eventData.title || !eventData.date || !eventData.time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // For now, just return success since we don't have the calendar_events table
    // In a real implementation, you would insert into the calendar_events table
    const newEvent = {
      id: Date.now().toString(),
      ...eventData,
      instructor_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newEvent,
      message: 'Event created successfully',
    });

  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
