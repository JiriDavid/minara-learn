import { clerkClient } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import connectToDB from '@/app/lib/db';
import Course from '@/app/models/Course';

export async function GET(request) {
  try {
    const { userId } = await clerkClient.authenticateRequest({
      request,
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDB();

    // Get user from database to verify they are a lecturer
    const User = (await import('@/app/models/User')).default;
    const user = await User.findOne({ clerkId: userId });

    if (!user || user.role !== 'lecturer') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Lecturer role required' },
        { status: 403 }
      );
    }

    // Find all courses created by this lecturer
    const courses = await Course.find({ instructor: user._id })
      .sort({ createdAt: -1 })
      .select('title slug description duration level isPublished category enrollmentCount averageRating revenue createdAt updatedAt');

    return NextResponse.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error('Error fetching lecturer courses:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
} 