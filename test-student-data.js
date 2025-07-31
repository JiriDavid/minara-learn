require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkAndCreateTestData() {
  try {
    console.log('Checking existing data...');
    
    // Check courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .limit(5);
    
    if (coursesError) {
      console.log('Courses error:', coursesError);
    } else {
      console.log('Courses found:', courses.length);
    }

    // Check profiles for instructors
    const { data: instructors, error: instructorsError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'instructor')
      .limit(1);
    
    if (instructorsError) {
      console.log('Instructors error:', instructorsError);
    } else {
      console.log('Instructors found:', instructors.length);
      
      // If we have no courses but have instructors, create some test courses
      if (courses.length === 0 && instructors.length > 0) {
        console.log('Creating test courses...');
        
        const testCourses = [
          {
            title: 'JavaScript Fundamentals',
            slug: 'javascript-fundamentals',
            description: 'Learn the basics of JavaScript programming',
            price: 99.99,
            duration: 20,
            level: 'Beginner',
            instructor_id: instructors[0].id,
            thumbnail: '/images/js-course.jpg',
            status: 'published'
          },
          {
            title: 'React - The Complete Guide',
            slug: 'react-complete-guide',
            description: 'Master React.js from basics to advanced concepts',
            price: 149.99,
            duration: 40,
            level: 'Intermediate',
            instructor_id: instructors[0].id,
            thumbnail: '/images/react-course.jpg',
            status: 'published'
          },
          {
            title: 'HTML & CSS Bootcamp',
            slug: 'html-css-bootcamp',
            description: 'Complete web development foundation course',
            price: 79.99,
            duration: 30,
            level: 'Beginner',
            instructor_id: instructors[0].id,
            thumbnail: '/images/html-css-course.jpg',
            status: 'published'
          }
        ];

        const { data: newCourses, error: createError } = await supabase
          .from('courses')
          .insert(testCourses)
          .select();

        if (createError) {
          console.log('Error creating courses:', createError);
        } else {
          console.log('Created courses:', newCourses.length);
        }
      }
    }

    // Check enrollments
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('*')
      .limit(5);
    
    if (enrollmentsError) {
      console.log('Enrollments error:', enrollmentsError);
    } else {
      console.log('Enrollments found:', enrollments.length);
    }

  } catch (error) {
    console.log('Error:', error.message);
  }
}

checkAndCreateTestData();
