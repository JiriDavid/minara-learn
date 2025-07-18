import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'overview';
    const days = parseInt(searchParams.get('days')) || 30;

    const supabase = await createClient();
    
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
      return NextResponse.json({ error: 'Unauthorized - Admin role required' }, { status: 403 });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    let reportData = {};

    switch (reportType) {
      case 'overview':
        reportData = await generateOverviewReport(supabase, startDate, endDate);
        break;
      case 'users':
        reportData = await generateUsersReport(supabase, startDate, endDate);
        break;
      case 'courses':
        reportData = await generateCoursesReport(supabase, startDate, endDate);
        break;
      case 'enrollments':
        reportData = await generateEnrollmentsReport(supabase, startDate, endDate);
        break;
      case 'revenue':
        reportData = await generateRevenueReport(supabase, startDate, endDate);
        break;
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: reportData,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days
      }
    });

  } catch (error) {
    console.error('Error in admin reports API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function generateOverviewReport(supabase, startDate, endDate) {
  try {
    // Get total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get new users in period
    const { count: newUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    // Get total courses
    const { count: totalCourses } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });

    // Get total enrollments
    const { count: totalEnrollments } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true });

    // Get enrollments in period
    const { count: newEnrollments } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    return {
      totalUsers: totalUsers || 0,
      newUsers: newUsers || 0,
      totalCourses: totalCourses || 0,
      totalEnrollments: totalEnrollments || 0,
      newEnrollments: newEnrollments || 0,
      userGrowthRate: totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(1) : 0,
      enrollmentGrowthRate: totalEnrollments > 0 ? ((newEnrollments / totalEnrollments) * 100).toFixed(1) : 0,
    };
  } catch (error) {
    console.error('Error generating overview report:', error);
    return {};
  }
}

async function generateUsersReport(supabase, startDate, endDate) {
  try {
    // Get user registrations by day
    const { data: usersByDay } = await supabase
      .from('profiles')
      .select('created_at, role')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    // Get user role distribution
    const { data: roleDistribution } = await supabase
      .from('profiles')
      .select('role')
      .not('role', 'is', null);

    const roleCounts = roleDistribution.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    return {
      usersByDay: usersByDay || [],
      roleDistribution: roleCounts,
      totalUsers: roleDistribution.length,
    };
  } catch (error) {
    console.error('Error generating users report:', error);
    return {};
  }
}

async function generateCoursesReport(supabase, startDate, endDate) {
  try {
    // Get courses with enrollment counts
    const { data: courses } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        instructor_id,
        created_at,
        published_at,
        enrollments(count)
      `);

    // For each course, calculate additional metrics
    const courseMetrics = await Promise.all(
      courses.map(async (course) => {
        // Get completion rate
        const { data: completions } = await supabase
          .from('enrollments')
          .select('progress')
          .eq('course_id', course.id);

        const avgProgress = completions.length > 0 
          ? completions.reduce((sum, e) => sum + (e.progress || 0), 0) / completions.length
          : 0;

        return {
          ...course,
          enrollmentCount: course.enrollments[0]?.count || 0,
          avgProgress: Math.round(avgProgress),
          completionRate: completions.filter(e => (e.progress || 0) >= 100).length,
        };
      })
    );

    return {
      courses: courseMetrics,
      totalCourses: courses.length,
    };
  } catch (error) {
    console.error('Error generating courses report:', error);
    return {};
  }
}

async function generateEnrollmentsReport(supabase, startDate, endDate) {
  try {
    // Get enrollments in period
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select(`
        created_at,
        progress,
        status,
        course:courses(title, category)
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    return {
      enrollments: enrollments || [],
      totalEnrollments: enrollments.length,
    };
  } catch (error) {
    console.error('Error generating enrollments report:', error);
    return {};
  }
}

async function generateRevenueReport(supabase, startDate, endDate) {
  try {
    // For now, return mock data since we don't have payment tracking
    // In a real implementation, you would query payment/transaction tables
    return {
      totalRevenue: 0,
      revenueByPeriod: [],
      revenueByCategory: {},
      note: 'Revenue tracking not implemented yet'
    };
  } catch (error) {
    console.error('Error generating revenue report:', error);
    return {};
  }
}
