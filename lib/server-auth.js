import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function getSession() {
  const cookieStore = cookies();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUserProfile() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookies().get(name)?.value;
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return session;
}

export async function isAdmin() {
  const profile = await getUserProfile();
  return profile?.role === "admin";
}

export async function requireAdmin() {
  const profile = await getUserProfile();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  return profile;
}
