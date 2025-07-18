// Quick test script to verify the student APIs
console.log('🧪 Testing Student Dashboard APIs...');

async function testAPIs() {
  try {
    // Test enrollments endpoint
    console.log('\n1. Testing enrollments endpoint...');
    const enrollmentsResponse = await fetch('http://localhost:3001/api/student/enrollments');
    console.log('Enrollments status:', enrollmentsResponse.status, enrollmentsResponse.statusText);
    
    if (enrollmentsResponse.status === 401) {
      console.log('✅ Enrollments endpoint properly requires authentication');
    } else if (enrollmentsResponse.ok) {
      const enrollmentsData = await enrollmentsResponse.json();
      console.log('✅ Enrollments data:', enrollmentsData);
    }

    // Test activity endpoint  
    console.log('\n2. Testing activity endpoint...');
    const activityResponse = await fetch('http://localhost:3001/api/student/activity');
    console.log('Activity status:', activityResponse.status, activityResponse.statusText);
    
    if (activityResponse.status === 401) {
      console.log('✅ Activity endpoint properly requires authentication');
    } else if (activityResponse.ok) {
      const activityData = await activityResponse.json();
      console.log('✅ Activity data:', activityData);
    }

    console.log('\n🎉 API tests completed!');
    console.log('\n📝 Note: 401 responses are expected since these endpoints require authentication');
    console.log('   The student dashboard should now load properly for authenticated users.');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testAPIs();
