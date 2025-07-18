# Minara Learn Learning Management System

A modern, responsive Learning Management System built with Next.js, MongoDB, and Clerk for authentication.

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

- **Frontend**: Next.js 14 with App Router, React, TailwindCSS, shadcn/ui
- **Authentication**: Clerk Authentication
- **Database**: MongoDB with Mongoose
- **State Management**: React Context API and Hooks
- **Styling**: TailwindCSS with custom components
- **API**: Next.js API Routes
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- MongoDB setup (local or Atlas)
- Clerk account

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
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # Webhook
   WEBHOOK_SECRET=your_clerk_webhook_secret
   ```

4. Set up your Clerk application:

   - Create a new application in the [Clerk Dashboard](https://dashboard.clerk.dev/)
   - Configure the authentication methods (email, social logins, etc.)
   - Add your application's domain to the allowed origins
   - Create a webhook endpoint pointing to `/api/webhooks/clerk` with the User events

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
│   ├── models/               # MongoDB models
│   ├── sign-in/              # Custom sign-in page
│   └── sign-up/              # Custom sign-up page
├── public/                   # Static assets
├── styles/                   # Global styles
├── middleware.js             # Clerk middleware for route protection
├── next.config.js            # Next.js configuration
└── package.json              # Project dependencies
```

## Development

### Database Models

The application uses the following main models:

- **User**: Stores user information, linked to Clerk users
- **Course**: Contains course details, curriculum, and metadata
- **Enrollment**: Tracks student enrollments and progress
- **Lesson**: Individual lessons within a course
- **Section**: Groups of lessons within a course
- **Completion**: Tracks completed lessons by students

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
- [Clerk](https://clerk.dev/)
- [MongoDB](https://www.mongodb.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
