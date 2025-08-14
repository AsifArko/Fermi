import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Create Sanity client directly
const client = createClient({
  projectId:
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_STUDIO_PROJECT_ID,
  dataset:
    process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-05-31',
  useCdn: false,
  token: process.env.SANITY_API_ADMIN_TOKEN,
});

async function purgeAllStudentData() {
  try {
    console.log('🚀 Starting complete purge of all student data...');

    // Get all enrollments
    const enrollments = await client.fetch(`
      *[_type == "enrollment"] {
        _id,
        _type,
        student->{clerkId},
        course->{title}
      }
    `);

    console.log(`📚 Found ${enrollments.length} enrollments to delete`);

    // Get all lesson completions
    const lessonCompletions = await client.fetch(`
      *[_type == "lessonCompletion"] {
        _id,
        _type,
        student->{clerkId},
        lesson->{title}
      }
    `);

    console.log(
      `✅ Found ${lessonCompletions.length} lesson completions to delete`
    );

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

    console.log(`👥 Found ${students.length} students to delete from Sanity`);

    if (
      enrollments.length === 0 &&
      lessonCompletions.length === 0 &&
      students.length === 0
    ) {
      console.log('✨ No data to purge. Database is already clean!');
      return;
    }

    // Batch delete all enrollments
    if (enrollments.length > 0) {
      console.log('\n🗑️  Batch deleting enrollments...');
      try {
        const enrollmentIds = enrollments.map(
          (e: unknown) => (e as { _id: string })._id
        );
        await client.delete(enrollmentIds);
        console.log(`   ❌ Batch deleted ${enrollments.length} enrollments`);
      } catch {
        console.error(
          '   ⚠️  Batch delete failed, falling back to individual deletes'
        );
        // Fallback to individual deletes
        for (const enrollment of enrollments) {
          try {
            await client.delete(enrollment._id);
            console.log(
              `   ❌ Deleted enrollment: ${enrollment.course?.title || 'Unknown Course'} for student: ${enrollment.student?.clerkId || 'Unknown'}`
            );
          } catch (error) {
            console.error(
              `   ⚠️  Failed to delete enrollment ${enrollment._id}:`,
              error
            );
          }
        }
      }
    }

    // Batch delete all lesson completions
    if (lessonCompletions.length > 0) {
      console.log('\n🗑️  Batch deleting lesson completions...');
      try {
        const completionIds = lessonCompletions.map(
          (c: unknown) => (c as { _id: string })._id
        );
        await client.delete(completionIds);
        console.log(
          `   ❌ Batch deleted ${lessonCompletions.length} lesson completions`
        );
      } catch {
        console.error(
          '   ⚠️  Batch delete failed, falling back to individual deletes'
        );
        // Fallback to individual deletes
        for (const completion of lessonCompletions) {
          try {
            await client.delete(completion._id);
            console.log(
              `   ❌ Deleted lesson completion: ${completion.lesson?.title || 'Unknown Lesson'} for student: ${completion.student?.clerkId || 'Unknown'}`
            );
          } catch (error) {
            console.error(
              `   ⚠️  Failed to delete lesson completion ${completion._id}:`,
              error
            );
          }
        }
      }
    }

    // Batch delete all students from Sanity
    if (students.length > 0) {
      console.log('\n🗑️  Batch deleting students from Sanity...');
      try {
        const studentIds = students.map(
          (s: unknown) => (s as { _id: string })._id
        );
        await client.delete(studentIds);
        console.log(
          `   ❌ Batch deleted ${students.length} students from Sanity`
        );
      } catch {
        console.error(
          '   ⚠️  Batch delete failed, falling back to individual deletes'
        );
        // Fallback to individual deletes
        for (const student of students) {
          try {
            await client.delete(student._id);
            console.log(
              `   ❌ Deleted student from Sanity: ${student.firstName} ${student.lastName} (${student.email}) - Clerk ID: ${student.clerkId}`
            );
          } catch (error) {
            console.error(
              `   ⚠️  Failed to delete student ${student._id}:`,
              error
            );
          }
        }
      }
    }

    console.log('\n🎉 Complete purge completed successfully!');
    console.log(`   📊 Total enrollments deleted: ${enrollments.length}`);
    console.log(
      `   📊 Total lesson completions deleted: ${lessonCompletions.length}`
    );
    console.log(`   📊 Total students deleted from Sanity: ${students.length}`);
    console.log(
      '\n⚠️  Note: Students have been removed from Sanity. You will need to manually delete them from Clerk Dashboard if desired.'
    );
    console.log(
      '\n💡 To delete students from Clerk, go to Clerk Dashboard > Users and manually delete them.'
    );
  } catch (error) {
    console.error('💥 Error during purge:', error);
    process.exit(1);
  }
}

// Run the purge
purgeAllStudentData()
  .then(() => {
    console.log('\n🏁 Script finished');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
