# Database Setup Instructions

## Apply Instructor Applications Schema

To set up the instructor applications system, you need to run the SQL schema in your Supabase database.

### Steps:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the content from `scripts/instructor-applications-schema.sql`
4. Execute the SQL

### What this schema includes:

- `instructor_applications` table for storing application data
- Row Level Security (RLS) policies for user and admin access
- Triggers to automatically update user profiles when applications are approved/rejected
- Indexes for performance
- `instructor_status` column added to profiles table

### Schema Summary:

```sql
-- Main table for instructor applications
instructor_applications (
  id, user_id, name, email, title, expertise, experience, 
  education, certifications, proposed_courses, teaching_philosophy,
  phone, linkedin, website, status, reviewed_by, reviewed_at,
  admin_notes, submitted_at, created_at, updated_at
)

-- Additional column in profiles table
profiles.instructor_status ('none', 'pending', 'approved', 'rejected')
```

### RLS Policies:
- Users can view and create their own applications
- Admins can view and update all applications

### Automatic Triggers:
- When application is approved → user role becomes 'instructor'
- When application status changes → profile.instructor_status is updated
- New applications trigger notification function (can be extended for emails)

After applying this schema, the instructor application system will be fully functional.
