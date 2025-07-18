import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        auth_user_metadata: user.user_metadata,
      },
      profile: profile || null,
      profile_error: profileError || null
    });
  } catch (error) {
    console.error('Debug user error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
