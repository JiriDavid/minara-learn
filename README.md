# Minara Learn Learning Management System

A modern, responsive Learning Management System built with Next.js and Supabase (Auth + Postgres).

## Features

- **Authentication**: Secure user authentication with Clerk, including social logins, email verification, and more
- **Role-based Access**: Different dashboards and features for students, instructors, and administrators
- **Course Management**: Create, edit, and publish courses with rich content
- **Curriculum Builder**: Organize courses into sections and lessons
- **Student Dashboard**: Track progress, view enrolled courses, and access learning resources
- **Instructor Dashboard**: Manage courses, track student performance, and create content
- **Admin Dashboard**: Manage users, view site analytics, and oversee all courses
- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React, TailwindCSS, shadcn/ui
- **Authentication**: Supabase Authentication
- **Database**: Supabase Postgres
- **State Management**: React Context API and Hooks
- **Styling**: TailwindCSS with custom components
- **API**: Next.js API Routes
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- Supabase account and project

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/minara-learn.git
   cd minara-learn
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. Set up your Supabase project:

   - Create a new project in the Supabase dashboard
   - Enable email/password sign-in (and optional OAuth providers)
   - Add your application's domain to the allowed redirects/origins
   - Run the SQL in `scripts/supabase-schema.sql` to create tables and RLS policies

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
minara-learn/
├── app/
│   ├── api/                  # API routes
│   ├── components/           # Shared components
│   ├── dashboard/            # Dashboard pages
│   │   ├── admin/            # Admin dashboard
│   │   ├── instructor/       # Instructor dashboard
│   │   └── student/          # Student dashboard
│   ├── learn/                # Course learning pages
│   ├── lib/                  # Utility functions and helpers
│   ├── auth/                 # Auth pages
├── public/                   # Static assets
├── styles/                   # Global styles
├── middleware.js             # Supabase middleware for session refresh
├── next.config.mjs           # Next.js configuration
└── package.json              # Project dependencies
```

## Development

### Database Models

The application uses the following main tables in Supabase:

- **profiles**: User profile and role
- **courses**: Course details, curriculum, and metadata
- **enrollments**: Tracks student enrollments and progress
- **lessons**: Individual lessons within a course
- **sections**: Groups of lessons within a course
- **completions**: Tracks completed lessons by students

### Role-Based Access

The application supports three user roles:

- **Student**: Can browse courses, enroll, track progress, and access learning materials
- **Instructor**: Can create and manage courses, track student progress, and view analytics
- **Admin**: Has full access to all features and can manage users and system settings

## Deployment

The application can be deployed to Vercel with minimal configuration:

1. Push your code to a GitHub repository
2. Create a new project in Vercel and connect to your repository
3. Add the environment variables from your `.env.local` file
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
