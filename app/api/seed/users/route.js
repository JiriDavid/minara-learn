import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import connectToDB from "@/lib/database";
import User from "@/models/User";

const ROLES = ["student", "lecturer", "admin"];
const DEFAULT_PASSWORD = "password123";

// Generate a random avatar URL
const getRandomAvatar = (index) => {
  return `https://randomuser.me/api/portraits/${
    Math.random() > 0.5 ? "men" : "women"
  }/${(index % 70) + 1}.jpg`;
};

// Generate a fake name
const getRandomName = () => {
  const firstNames = [
    "James",
    "Mary",
    "John",
    "Patricia",
    "Robert",
    "Jennifer",
    "Michael",
    "Linda",
    "William",
    "Elizabeth",
    "David",
    "Susan",
    "Richard",
    "Jessica",
    "Joseph",
    "Sarah",
    "Thomas",
    "Karen",
    "Charles",
    "Nancy",
    "Emma",
    "Oliver",
    "Charlotte",
    "Sophia",
    "Mia",
    "Amelia",
    "Harper",
    "Evelyn",
    "Abigail",
    "Liam",
    "Noah",
    "William",
    "Lucas",
    "Benjamin",
    "Mason",
    "Ethan",
    "Olivia",
    "Ava",
    "Isabella",
  ];

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Torres",
    "Nguyen",
    "Hill",
    "Flores",
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

export async function POST() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user || user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Clear existing users
    await User.deleteMany({});

    // Create sample users
    const users = [
      {
        name: "John Doe",
        email: "john@example.com",
        role: "student",
        image: "/images/instructor-1.jpg",
        bio: "Passionate about learning new technologies",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        role: "lecturer",
        image: "/images/instructor-2.jpg",
        bio: "Experienced web development instructor",
      },
      {
        name: "Mike Johnson",
        email: "mike@example.com",
        role: "admin",
        image: "/images/instructor-3.jpg",
        bio: "Platform administrator",
      },
    ];

    const createdUsers = await User.insertMany(users);

    return NextResponse.json({
      message: "Users seeded successfully",
      count: createdUsers.length,
    });
  } catch (error) {
    console.error("Error seeding users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    // Connect to DB
    await connectToDB();

    // Count users by role
    const studentCount = await User.countDocuments({ role: "student" });
    const lecturerCount = await User.countDocuments({ role: "lecturer" });
    const adminCount = await User.countDocuments({ role: "admin" });
    const totalCount = await User.countDocuments({});

    return NextResponse.json({
      success: true,
      counts: {
        students: studentCount,
        lecturers: lecturerCount,
        admins: adminCount,
        total: totalCount,
      },
    });
  } catch (error) {
    console.error("Error getting user stats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get user stats: " + error.message },
      { status: 500 }
    );
  }
}
