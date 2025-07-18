import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Try to get a sample profile to see what columns exist
    const { data: profileSample, error: sampleError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    const availableColumns = profileSample && profileSample.length > 0 
      ? Object.keys(profileSample[0]) 
      : [];

    return NextResponse.json({
      success: true,
      message: "Schema check completed",
      availableColumns,
      sampleData: profileSample,
      sampleError: sampleError?.message || null,
      hasName: availableColumns.includes('name'),
      hasFullName: availableColumns.includes('full_name')
    });

  } catch (error) {
    console.error("Schema check error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.constructor.name
    }, { status: 500 });
  }
}
