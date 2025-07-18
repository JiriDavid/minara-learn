// Test database connection and schema
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key exists:", !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  try {
    // Test 1: Check profiles table structure
    console.log("\n=== Testing profiles table structure ===");
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .limit(1);
    
    if (profilesError) {
      console.error("Profiles table error:", profilesError);
    } else {
      console.log("Profiles table accessible:", profiles !== null);
      console.log("Sample profile structure:", profiles[0] || "No profiles found");
    }

    // Test 2: Check auth connection
    console.log("\n=== Testing auth connection ===");
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Auth session error:", sessionError);
    } else {
      console.log("Auth connection working:", session !== null);
    }

    // Test 3: Try to create a test profile (will fail if table doesn't exist)
    console.log("\n=== Testing profile creation ===");
    const testProfile = {
      id: "test-uuid-123",
      email: "test@example.com",
      full_name: "Test User",
      role: "student"
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from("profiles")
      .insert([testProfile])
      .select();
    
    if (insertError) {
      console.error("Profile insert error:", insertError.message);
    } else {
      console.log("Profile creation test successful");
      
      // Clean up test data
      await supabase.from("profiles").delete().eq("id", "test-uuid-123");
    }
    
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testDatabase();
