import { NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

// GET - Fetch all instructor applications (admin only)
export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Fetch all instructor applications
    const { data: applications, error } = await supabaseServiceRole
      .from('instructor_applications')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error in GET /api/admin/instructor-applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Approve or reject instructor application (admin only)
export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { applicationId, action, adminNotes } = await request.json();

    if (!applicationId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Get the application first
    const { data: application, error: fetchError } = await supabaseServiceRole
      .from('instructor_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (fetchError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.status !== 'pending') {
      return NextResponse.json({ error: 'Application has already been processed' }, { status: 400 });
    }

    // Update application status
    const updateData = {
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      admin_notes: adminNotes || null
    };

    const { error: updateError } = await supabaseServiceRole
      .from('instructor_applications')
      .update(updateData)
      .eq('id', applicationId);

    if (updateError) {
      console.error('Error updating application:', updateError);
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }

    // If approved, update user profile to instructor role
    if (action === 'approve') {
      // First, check if user exists in auth.users
      const { data: authUser, error: authCheckError } = await supabaseServiceRole.auth.admin.getUserById(application.user_id);
      
      if (authCheckError || !authUser.user) {
        console.error('User not found in auth.users:', authCheckError);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Update user profile role
      const { error: profileError } = await supabaseServiceRole
        .from('profiles')
        .update({ 
          role: 'instructor',
          updated_at: new Date().toISOString()
        })
        .eq('id', application.user_id);

      if (profileError) {
        console.error('Error updating user profile:', profileError);
        return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Application ${action}ed successfully` 
    });

  } catch (error) {
    console.error('Error in PATCH /api/admin/instructor-applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
