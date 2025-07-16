import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json(
    { message: "Seed routes are disabled. Please use Supabase directly for seeding data." },
    { status: 501 }
  );
}
