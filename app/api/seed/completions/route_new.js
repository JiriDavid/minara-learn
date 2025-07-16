import { NextResponse } from "next/server";

// POST - seed completions (disabled in production)
export async function POST(request) {
  return NextResponse.json(
    { message: "Seed routes are disabled. Please use Supabase directly for seeding data." },
    { status: 501 }
  );
}

// DELETE - clear completions (disabled in production)
export async function DELETE(request) {
  return NextResponse.json(
    { message: "Seed routes are disabled. Please use Supabase directly for managing data." },
    { status: 501 }
  );
}
