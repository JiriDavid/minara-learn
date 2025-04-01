import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import connectToDB from "@/lib/database";
import User from "@/models/User";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const dbUser = await User.findOne({ clerkId: user.id });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({
      id: dbUser._id,
      clerkId: dbUser.clerkId,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      image: dbUser.image,
      bio: dbUser.bio,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
