/**
 * Data Migration Script from MongoDB to Supabase
 *
 * This script reads data from MongoDB collections and imports it into Supabase.
 *
 * Prerequisites:
 * 1. Both MongoDB and Supabase credentials should be available in .env
 * 2. Run `npm install mongodb @supabase/supabase-js dotenv uuid` before running this script
 *
 * Usage: node migrate-to-supabase.js
 */
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const { createClient } = require("@supabase/supabase-js");
const { v4: uuidv4 } = require("uuid");

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
const mongoClient = new MongoClient(MONGODB_URI);

// Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ID mapping object to track MongoDB ObjectIDs to UUID conversions
const idMappings = {
  users: {},
  courses: {},
  sections: {},
  lessons: {},
};

async function migrateUsers() {
  console.log("Migrating users...");
  const db = mongoClient.db();
  const users = await db.collection("users").find({}).toArray();

  for (const user of users) {
    const uuid = uuidv4();
    idMappings.users[user._id.toString()] = uuid;

    // Create user in Supabase Auth
    try {
      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email: user.email,
          password: "TemporaryPassword123!", // Users will need to reset password
          email_confirm: true,
          user_metadata: {
            full_name: user.name,
          },
        });

      if (authError) {
        console.error(`Error creating auth user ${user.email}:`, authError);
        continue;
      }

      // Add user to profiles table
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authUser.user.id,
        email: user.email,
        full_name: user.name,
        avatar_url: user.image,
        bio: user.bio || "",
        role: user.role || "student",
        created_at: user.createdAt || new Date(),
      });

      if (profileError) {
        console.error(
          `Error creating profile for ${user.email}:`,
          profileError
        );
      } else {
        console.log(`Migrated user: ${user.email}`);
      }
    } catch (error) {
      console.error(`General error migrating user ${user.email}:`, error);
    }
  }
}

async function migrateCourses() {
  console.log("Migrating courses...");
  const db = mongoClient.db();
  const courses = await db.collection("courses").find({}).toArray();

  for (const course of courses) {
    const uuid = uuidv4();
    idMappings.courses[course._id.toString()] = uuid;

    // Get instructor UUID from mappings
    const instructorId = course.lecturer
      ? idMappings.users[course.lecturer.toString()]
      : null;

    try {
      const { error } = await supabase.from("courses").insert({
        id: uuid,
        title: course.title,
        slug: course.slug,
        description: course.description,
        thumbnail: course.thumbnail,
        price: course.price || 0,
        discount: course.discount || 0,
        is_published: course.isPublished || false,
        instructor_id: instructorId,
        category: course.category,
        level: course.level,
        duration: course.duration,
        average_rating: course.ratings || 0,
        num_reviews: course.numReviews || 0,
        num_students: course.numStudents || 0,
        created_at: course.createdAt || new Date(),
        updated_at: course.updatedAt || new Date(),
      });

      if (error) {
        console.error(`Error creating course ${course.title}:`, error);
      } else {
        console.log(`Migrated course: ${course.title}`);
      }
    } catch (error) {
      console.error(`General error migrating course ${course.title}:`, error);
    }
  }
}

async function migrateSections() {
  console.log("Migrating sections...");
  const db = mongoClient.db();
  const sections = await db.collection("sections").find({}).toArray();

  for (const section of sections) {
    const uuid = uuidv4();
    idMappings.sections[section._id.toString()] = uuid;

    // Get course UUID from mappings
    const courseId = idMappings.courses[section.course.toString()];
    if (!courseId) {
      console.error(`Course ID not found for section ${section.title}`);
      continue;
    }

    try {
      const { error } = await supabase.from("sections").insert({
        id: uuid,
        title: section.title,
        course_id: courseId,
        order_index: section.order || 0,
        created_at: section.createdAt || new Date(),
        updated_at: section.updatedAt || new Date(),
      });

      if (error) {
        console.error(`Error creating section ${section.title}:`, error);
      } else {
        console.log(`Migrated section: ${section.title}`);
      }
    } catch (error) {
      console.error(`General error migrating section ${section.title}:`, error);
    }
  }
}

async function migrateLessons() {
  console.log("Migrating lessons...");
  const db = mongoClient.db();
  const lessons = await db.collection("lessons").find({}).toArray();

  for (const lesson of lessons) {
    const uuid = uuidv4();
    idMappings.lessons[lesson._id.toString()] = uuid;

    // Get section UUID from mappings
    const sectionId = idMappings.sections[lesson.section.toString()];
    if (!sectionId) {
      console.error(`Section ID not found for lesson ${lesson.title}`);
      continue;
    }

    try {
      const { error } = await supabase.from("lessons").insert({
        id: uuid,
        title: lesson.title,
        content: lesson.content,
        video_url: lesson.videoUrl,
        duration: lesson.duration,
        is_free: lesson.isFree || false,
        section_id: sectionId,
        order_index: lesson.order || 0,
        created_at: lesson.createdAt || new Date(),
        updated_at: lesson.updatedAt || new Date(),
      });

      if (error) {
        console.error(`Error creating lesson ${lesson.title}:`, error);
      } else {
        console.log(`Migrated lesson: ${lesson.title}`);
      }
    } catch (error) {
      console.error(`General error migrating lesson ${lesson.title}:`, error);
    }
  }
}

async function migrateEnrollments() {
  console.log("Migrating enrollments...");
  const db = mongoClient.db();
  const enrollments = await db.collection("enrollments").find({}).toArray();

  for (const enrollment of enrollments) {
    // Get UUIDs from mappings
    const userId = idMappings.users[enrollment.user.toString()];
    const courseId = idMappings.courses[enrollment.course.toString()];

    if (!userId || !courseId) {
      console.error(`User or Course ID not found for enrollment`);
      continue;
    }

    try {
      const { error } = await supabase.from("enrollments").insert({
        user_id: userId,
        course_id: courseId,
        status: enrollment.status || "active",
        progress: enrollment.progress || 0,
        completed_lessons: enrollment.completedLessons
          ? JSON.stringify(
              enrollment.completedLessons.map(
                (id) => idMappings.lessons[id.toString()] || id.toString()
              )
            )
          : "[]",
        enrollment_date: enrollment.enrollmentDate || new Date(),
        last_accessed: enrollment.lastAccessed || new Date(),
      });

      if (error) {
        console.error(`Error creating enrollment:`, error);
      } else {
        console.log(
          `Migrated enrollment for user ${userId} in course ${courseId}`
        );
      }
    } catch (error) {
      console.error(`General error migrating enrollment:`, error);
    }
  }
}

async function migrateReviews() {
  console.log("Migrating reviews...");
  const db = mongoClient.db();
  const reviews = await db.collection("reviews").find({}).toArray();

  for (const review of reviews) {
    // Get UUIDs from mappings
    const userId = idMappings.users[review.user.toString()];
    const courseId = idMappings.courses[review.course.toString()];

    if (!userId || !courseId) {
      console.error(`User or Course ID not found for review`);
      continue;
    }

    try {
      const { error } = await supabase.from("reviews").insert({
        user_id: userId,
        course_id: courseId,
        rating: review.rating,
        review_text: review.reviewText || "",
        created_at: review.createdAt || new Date(),
        updated_at: review.updatedAt || new Date(),
      });

      if (error) {
        console.error(`Error creating review:`, error);
      } else {
        console.log(`Migrated review for user ${userId} in course ${courseId}`);
      }
    } catch (error) {
      console.error(`General error migrating review:`, error);
    }
  }
}

async function migrateCertificates() {
  console.log("Migrating certificates...");
  const db = mongoClient.db();
  const certificates = await db.collection("certificates").find({}).toArray();

  for (const certificate of certificates) {
    // Get UUIDs from mappings
    const userId = idMappings.users[certificate.user.toString()];
    const courseId = idMappings.courses[certificate.course.toString()];

    if (!userId || !courseId) {
      console.error(`User or Course ID not found for certificate`);
      continue;
    }

    try {
      const { error } = await supabase.from("certificates").insert({
        user_id: userId,
        course_id: courseId,
        certificate_number: certificate.certificateNumber,
        issue_date: certificate.issueDate || new Date(),
      });

      if (error) {
        console.error(`Error creating certificate:`, error);
      } else {
        console.log(
          `Migrated certificate for user ${userId} in course ${courseId}`
        );
      }
    } catch (error) {
      console.error(`General error migrating certificate:`, error);
    }
  }
}

async function main() {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");

    // Migrate data in order of dependencies
    await migrateUsers();
    await migrateCourses();
    await migrateSections();
    await migrateLessons();
    await migrateEnrollments();
    await migrateReviews();
    await migrateCertificates();

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoClient.close();
  }
}

main();
