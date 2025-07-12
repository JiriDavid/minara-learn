# Clerk to Supabase Migration Guide

This guide provides the steps to fully migrate authentication from Clerk to Supabase in the E-X-TRA LMS application.

## What's Already Done

The following components have already been migrated:

- The Supabase client setup in `lib/supabase.js`
- A new AuthContext provider in `lib/auth-context.js`
- Server-side auth utilities in `lib/server-auth.js`
- The login and registration pages
- The main app layout is updated to use the Supabase AuthProvider
- The middleware is updated to use Supabase
- Navbar has been updated to use Supabase auth
- The homepage and some key pages have been updated
- SQL schema for your Supabase database defined in `scripts/supabase-schema.sql`
- A data migration script from MongoDB to Supabase in `scripts/migrate-to-supabase.js`

## Next Steps to Complete the Migration

### 1. Set Up Your Supabase Project

1. Sign up for a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your Supabase URL and anon key from the project settings
4. Create a `.env.local` file at the root of your project with:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 2. Create the Database Schema

1. Go to your Supabase project's SQL Editor
2. Create a new query and paste the contents of `scripts/supabase-schema.sql`
3. Run the query to create all the necessary tables and policies

### 3. Update Client-Side Components

We've created a script to help update client components from using Clerk to Supabase:

```bash
node scripts/update-clerk-to-supabase.mjs
```

This will update most client-side components, but manual review is still necessary.

### 4. Update API Routes

The API routes still use Clerk for authentication. You'll need to modify them to use Supabase:

1. Update server-side authentication in API routes:

   - Replace `import { auth, clerkClient } from "@clerk/nextjs/server";` with `import { getSession, getUserProfile } from "@/lib/server-auth";`
   - Replace `auth()` usage with `await getSession()` to get the current session
   - Replace user data fetching from Clerk with Supabase queries

2. Example of a converted API route:

```javascript
// Before (with Clerk)
import { auth } from "@clerk/nextjs/server";

export async function GET(request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Rest of the code...
}

// After (with Supabase)
import { getSession } from "@/lib/server-auth";

export async function GET(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  // Rest of the code...
}
```

### 5. Migrate User Data

If you have existing users in Clerk, you'll need to migrate them to Supabase:

1. Install required dependencies:

   ```bash
   npm install uuid dotenv mongodb
   ```

2. Update the MongoDB URI in `.env.local`:

   ```
   MONGODB_URI=your-mongodb-uri
   ```

3. Run the migration script:
   ```bash
   node scripts/migrate-to-supabase.js
   ```

### 6. Remove Clerk Dependencies

Once everything is migrated and working:

1. Remove Clerk from package.json
2. Remove any remaining Clerk UI components or imports
3. Remove Clerk environment variables

### 7. Test Everything

Make sure to test all authentication flows:

- Registration
- Login
- Profile update
- Role-based access
- Protected routes
- API endpoints

## Common Issues

1. **Session not persisting**: Make sure your Supabase client is configured correctly and the auth state change is being watched.

2. **Role-based access not working**: You may need to update how roles are stored and queried in your Supabase profiles table.

3. **API routes returning 401**: Ensure you're using `getSession()` correctly in your API routes.

## Need Help?

If you encounter issues during migration, check the Supabase documentation:

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
