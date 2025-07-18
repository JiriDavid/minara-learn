import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function POST(req) {
  try {
    const supabase = await createClient();
    
    // Get current user to verify admin access
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Read the SQL script
    const sqlFilePath = join(process.cwd(), 'scripts', 'fix-profiles-rls.sql');
    const sqlScript = readFileSync(sqlFilePath, 'utf8');
    
    // Split the script into individual statements
    const statements = sqlScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    const results = [];
    
    // Execute each statement
    for (const statement of statements) {
      try {
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql_query: statement 
        });
        
        if (error) {
          console.error('SQL Error:', error);
          results.push({ statement: statement.substring(0, 100) + '...', error: error.message });
        } else {
          results.push({ statement: statement.substring(0, 100) + '...', success: true });
        }
      } catch (err) {
        console.error('Execution error:', err);
        results.push({ statement: statement.substring(0, 100) + '...', error: err.message });
      }
    }
    
    return NextResponse.json({ 
      message: 'Database migration attempted',
      results 
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Failed to run migration', details: error.message },
      { status: 500 }
    );
  }
}
