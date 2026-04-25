import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Create Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_ADMIN_TOKEN!, // Use admin token for write access
  apiVersion: '2024-01-01',
  useCdn: false,
});

interface OldEnrollment {
  _id: string;
  _type: 'enrollment';
  student: { _ref: string };
  course: { _ref: string };
  amount: number;
  paymentId?: string;
  enrolledAt: string;
}

interface OldStudent {
  _id: string;
  _type: 'student';
  _createdAt?: string;
  clerkId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

/**
 * Migrate existing enrollments to new schema
 */
async function migrateEnrollments() {
  try {
    console.log('Starting enrollment migration...');

    // Get all existing enrollments
    const enrollments = await client.fetch<OldEnrollment[]>(`
      *[_type == "enrollment"]
    `);

    console.log(`Found ${enrollments.length} enrollments to migrate`);

    for (const enrollment of enrollments) {
      try {
        // Update enrollment with new fields
        await client
          .patch(enrollment._id)
          .set({
            status: 'active', // Default all existing enrollments to active
            expiresAt: null, // No expiration for existing enrollments
            metadata: {
              enrollmentSource: 'migration',
              migratedAt: new Date().toISOString(),
            },
          })
          .commit();

        console.log(`Migrated enrollment ${enrollment._id}`);
      } catch (error) {
        console.error(`Failed to migrate enrollment ${enrollment._id}:`, error);
      }
    }

    console.log('Enrollment migration completed!');
  } catch (error) {
    console.error('Error during enrollment migration:', error);
  }
}

/**
 * Migrate existing students to new schema
 */
async function migrateStudents() {
  try {
    console.log('Starting student migration...');

    // Get all existing students
    const students = await client.fetch<OldStudent[]>(`
      *[_type == "student"]
    `);

    console.log(`Found ${students.length} students to migrate`);

    for (const student of students) {
      try {
        // Update student with new fields
        await client
          .patch(student._id)
          .set({
            isActive: true, // Default all existing students to active
            createdAt: student._createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .commit();

        console.log(`Migrated student ${student._id}`);
      } catch (error) {
        console.error(`Failed to migrate student ${student._id}:`, error);
      }
    }

    console.log('Student migration completed!');
  } catch (error) {
    console.error('Error during student migration:', error);
  }
}

/**
 * Validate migration results
 */
async function validateMigration() {
  try {
    console.log('Validating migration...');

    // Check enrollments
    const enrollments = await client.fetch(`
      *[_type == "enrollment"] {
        _id,
        status,
        metadata,
        _createdAt,
        _updatedAt
      }
    `);

    const validEnrollments = enrollments.filter(
      (e: unknown) => (e as { status: unknown }).status
    );
    console.log(
      `Enrollments with status: ${validEnrollments.length}/${enrollments.length}`
    );

    // Check students
    const students = await client.fetch(`
      *[_type == "student"] {
        _id,
        isActive,
        createdAt,
        updatedAt
      }
    `);

    const validStudents = students.filter(
      (s: unknown) => (s as { isActive: unknown }).isActive !== undefined
    );
    console.log(
      `Students with isActive: ${validStudents.length}/${students.length}`
    );

    console.log('Migration validation completed!');
  } catch (error) {
    console.error('Error during validation:', error);
  }
}

/**
 * Main migration function
 */
async function runMigration() {
  try {
    console.log('Starting enrollment system migration...\n');

    // Run migrations
    await migrateEnrollments();
    console.log('');
    await migrateStudents();
    console.log('');

    // Validate results
    await validateMigration();
    console.log('');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  runMigration();
}
