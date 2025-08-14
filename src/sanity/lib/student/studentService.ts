import { client } from '../adminClient';
import { sanityFetch } from '../live';
import { defineQuery } from 'groq';

// Types for the new student system
export interface Student {
  _id: string;
  _type: 'student';
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentParams {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

export interface UpdateStudentParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: string;
  isActive?: boolean;
}

/**
 * Get student by Clerk ID
 */
export async function getStudentByClerkId(
  clerkId: string
): Promise<Student | null> {
  try {
    const query = defineQuery(`
      *[_type == "student" && clerkId == $clerkId][0] {
        _id,
        clerkId,
        email,
        firstName,
        lastName,
        imageUrl,
        isActive,
        createdAt,
        updatedAt
      }
    `);

    const result = await sanityFetch({
      query,
      params: { clerkId },
    });

    return result?.data || null;
  } catch (error) {
    console.error('Error getting student by Clerk ID:', error);
    return null;
  }
}

/**
 * Get or create student - only creates if user actually enrolls
 */
export async function getOrCreateStudent(
  params: CreateStudentParams
): Promise<Student> {
  try {
    const { clerkId, email, firstName, lastName, imageUrl } = params;

    // Validate required fields
    if (!clerkId || !email) {
      throw new Error('Missing required student parameters');
    }

    // First check if student exists
    const existingStudent = await getStudentByClerkId(clerkId);

    if (existingStudent) {
      // Update student information if needed
      const needsUpdate =
        existingStudent.email !== email ||
        existingStudent.firstName !== firstName ||
        existingStudent.lastName !== lastName ||
        existingStudent.imageUrl !== imageUrl;

      if (needsUpdate) {
        return await updateStudent(existingStudent._id, {
          email,
          firstName,
          lastName,
          imageUrl,
        });
      }

      return existingStudent;
    }

    // Create new student only when explicitly needed (during enrollment)
    throw new Error(
      'Student does not exist. Create student only during enrollment.'
    );
  } catch (error) {
    console.error('Error in getOrCreateStudent:', error);
    throw error;
  }
}

/**
 * Create a new student (only called during enrollment)
 */
export async function createStudent(
  params: CreateStudentParams
): Promise<Student> {
  try {
    const { clerkId, email, firstName, lastName, imageUrl } = params;

    // Validate required fields
    if (!clerkId || !email) {
      throw new Error('Missing required student parameters');
    }

    // Check if student already exists
    const existingStudent = await getStudentByClerkId(clerkId);
    if (existingStudent) {
      throw new Error('Student already exists with this Clerk ID');
    }

    // Create new student
    const student = await client.create({
      _type: 'student',
      clerkId,
      email,
      firstName,
      lastName,
      imageUrl,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('Student created successfully:', student);
    return student as unknown as Student;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
}

/**
 * Update student information
 */
export async function updateStudent(
  studentId: string,
  updates: UpdateStudentParams
): Promise<Student> {
  try {
    const updatedStudent = await client
      .patch(studentId)
      .set({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    console.log('Student updated successfully:', updatedStudent);
    return updatedStudent as unknown as Student;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
}

/**
 * Deactivate student account
 */
export async function deactivateStudent(studentId: string): Promise<Student> {
  try {
    const deactivatedStudent = await client
      .patch(studentId)
      .set({
        isActive: false,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    console.log('Student deactivated successfully:', deactivatedStudent);
    return deactivatedStudent as unknown as Student;
  } catch (error) {
    console.error('Error deactivating student:', error);
    throw error;
  }
}

/**
 * Reactivate student account
 */
export async function reactivateStudent(studentId: string): Promise<Student> {
  try {
    const reactivatedStudent = await client
      .patch(studentId)
      .set({
        isActive: true,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    console.log('Student reactivated successfully:', reactivatedStudent);
    return reactivatedStudent as unknown as Student;
  } catch (error) {
    console.error('Error reactivating student:', error);
    throw error;
  }
}

/**
 * Get all students (for admin purposes)
 */
export async function getAllStudents(): Promise<Student[]> {
  try {
    const query = defineQuery(`
      *[_type == "student"] | order(createdAt desc) {
        _id,
        clerkId,
        email,
        firstName,
        lastName,
        imageUrl,
        isActive,
        createdAt,
        updatedAt
      }
    `);

    const result = await sanityFetch({
      query,
    });

    return result?.data || [];
  } catch (error) {
    console.error('Error getting all students:', error);
    return [];
  }
}

/**
 * Get student statistics
 */
export async function getStudentStats(): Promise<{
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
}> {
  try {
    const stats = await client.fetch(`
      {
        "totalStudents": count(*[_type == "student"]),
        "activeStudents": count(*[_type == "student" && isActive == true]),
        "inactiveStudents": count(*[_type == "student" && isActive == false])
      }
    `);

    return (
      stats || {
        totalStudents: 0,
        activeStudents: 0,
        inactiveStudents: 0,
      }
    );
  } catch (error) {
    console.error('Error getting student stats:', error);
    return {
      totalStudents: 0,
      activeStudents: 0,
      inactiveStudents: 0,
    };
  }
}
