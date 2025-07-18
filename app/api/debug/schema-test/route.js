import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // Let's try to create a test profile with different field combinations
    const testId = '00000000-0000-0000-0000-000000000001';
    const testEmail = 'schema-test@example.com';

    // Test 1: Try with 'name' field
    const { data: test1, error: error1 } = await supabase
      .from('profiles')
      .insert({
        id: testId,
        email: testEmail,
        name: 'Test User',
        role: 'student'
      })
      .select()
      .single();

    if (!error1) {
      // Clean up
      await supabase.from('profiles').delete().eq('id', testId);
      return NextResponse.json({
        success: true,
        schema: 'name field works',
        columns: Object.keys(test1),
        data: test1
      });
    }

    // Test 2: Try with 'full_name' field
    const { data: test2, error: error2 } = await supabase
      .from('profiles')
      .insert({
        id: testId,
        email: testEmail,
        full_name: 'Test User',
        role: 'student'
      })
      .select()
      .single();

    if (!error2) {
      // Clean up
      await supabase.from('profiles').delete().eq('id', testId);
      return NextResponse.json({
        success: true,
        schema: 'full_name field works',
        columns: Object.keys(test2),
        data: test2
      });
    }

    // Test 3: Try with minimal fields only
    const { data: test3, error: error3 } = await supabase
      .from('profiles')
      .insert({
        id: testId,
        email: testEmail,
        role: 'student'
      })
      .select()
      .single();

    if (!error3) {
      // Clean up
      await supabase.from('profiles').delete().eq('id', testId);
      return NextResponse.json({
        success: true,
        schema: 'minimal fields work',
        columns: Object.keys(test3),
        data: test3
      });
    }

    return NextResponse.json({
      success: false,
      errors: {
        nameError: error1?.message,
        fullNameError: error2?.message,
        minimalError: error3?.message
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
