import { NextResponse } from "next/server";

export async function POST(request) {
  return NextResponse.json(
    { message: "Seed routes are disabled. Please use Supabase directly for seeding data." },
    { status: 501 }
  );
}

export async function DELETE(request) {
  return NextResponse.json(
    { message: "Seed routes are disabled. Please use Supabase directly for managing data." },
    { status: 501 }
  );
}
