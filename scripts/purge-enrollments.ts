import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Validate required environment variables
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET;
const token = process.env.SANITY_API_ADMIN_TOKEN;

if (!projectId || !dataset) {
  throw new Error(
    'Missing required Sanity environment variables: NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET'
  );
}

// Create Sanity client directly
interface SanityConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
  useCdn: boolean;
  token?: string;
}

const config: SanityConfig = {
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-05-31',
  useCdn: false,
};

if (token) {
  config.token = token;
}

const client = createClient(config);

async function purgeAllStudentData() {
  try {
    // Get all enrollments
    const enrollments = await client.fetch(`
      *[_type == "enrollment"] {
        _id,
        _type,
        student->{clerkId},
        course->{title}
      }
    `);

    // Get all lesson completions
    const lessonCompletions = await client.fetch(`
      *[_type == "lessonCompletion"] {
        _id,
        _type,
        student->{clerkId},
        lesson->{title}
      }
    `);

    // Get all students from Sanity
    const students = await client.fetch(`
      *[_type == "student"] {
        _id,
        _type,
        clerkId,
        email,
        firstName,
        lastName
      }
    `);

    if (
      enrollments.length === 0 &&
      lessonCompletions.length === 0 &&
      students.length === 0
    ) {
      return;
    }

    // Batch delete all enrollments
    if (enrollments.length > 0) {
      try {
        const enrollmentIds = enrollments.map(
          (e: unknown) => (e as { _id: string })._id
        );
        await client.delete(enrollmentIds);
      } catch {
        // Fallback to individual deletes
        for (const enrollment of enrollments) {
          try {
            await client.delete(enrollment._id);
          } catch {
            // Silently continue on individual failures
          }
        }
      }
    }

    // Batch delete all lesson completions
    if (lessonCompletions.length > 0) {
      try {
        const completionIds = lessonCompletions.map(
          (c: unknown) => (c as { _id: string })._id
        );
        await client.delete(completionIds);
      } catch {
        // Fallback to individual deletes
        for (const completion of lessonCompletions) {
          try {
            await client.delete(completion._id);
          } catch {
            // Silently continue on individual failures
          }
        }
      }
    }

    // Batch delete all students from Sanity
    if (students.length > 0) {
      try {
        const studentIds = students.map(
          (s: unknown) => (s as { _id: string })._id
        );
        await client.delete(studentIds);
      } catch {
        // Fallback to individual deletes
        for (const student of students) {
          try {
            await client.delete(student._id);
          } catch {
            // Silently continue on individual failures
          }
        }
      }
    }
  } catch {
    process.exit(1);
  }
}

// Run the purge
purgeAllStudentData()
  .then(() => {
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
