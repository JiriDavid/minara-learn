import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = createClient();

    console.log("Checking profiles table structure...");
    
    // Try to get a sample profile to see what columns exist
    const { data: profileSample, error: sampleError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single();

    const availableColumns = profileSample ? Object.keys(profileSample) : [];
    
    // Test if we can insert a profile with full_name
    const testData = {
      id: '00000000-0000-0000-0000-000000000000', // Test UUID
      email: 'test@migration.com',
      full_name: 'Test User',
      role: 'student'
    };

    const { data: testInsert, error: testError } = await supabase
      .from('profiles')
      .insert(testData)
      .select()
      .single();

    if (testInsert) {
      // Clean up test data
      await supabase
        .from('profiles')
        .delete()
        .eq('id', testData.id);
    }

    return NextResponse.json({
      success: true,
      message: "Schema check completed",
      availableColumns,
      sampleData: profileSample,
      sampleError: sampleError?.message || null,
      testError: testError?.message || null,
      hasFullName: availableColumns.includes('full_name'),
      migration: {
        needed: !availableColumns.includes('full_name'),
        sqlCommand: "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;"
      }
    });

  } catch (error) {
    console.error("Migration check error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.constructor.name
    }, { status: 500 });
  }
}
