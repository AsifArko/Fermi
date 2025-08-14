import { defineQuery } from 'groq';

import { client } from '../adminClient';
import { sanityFetch } from '../live';

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
    const studentByClerkIdQuery = defineQuery(`
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
      query: studentByClerkIdQuery,
      params: { clerkId },
    });

    const studentData = result?.data;
    if (!studentData) return null;

    // Transform the query result to match the Student interface
    const student: {
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
    } = {
      _id: studentData._id,
      _type: 'student' as const,
      clerkId: studentData.clerkId || '',
      email: studentData.email || '',
      isActive: studentData.isActive || false,
      createdAt: studentData.createdAt || new Date().toISOString(),
      updatedAt: studentData.updatedAt || new Date().toISOString(),
    };

    if (studentData.firstName) student.firstName = studentData.firstName;
    if (studentData.lastName) student.lastName = studentData.lastName;
    if (studentData.imageUrl) student.imageUrl = studentData.imageUrl;

    return student;
  } catch {
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
        const updateParams: {
          email: string;
          firstName?: string;
          lastName?: string;
          imageUrl?: string;
        } = { email };
        if (firstName) updateParams.firstName = firstName;
        if (lastName) updateParams.lastName = lastName;
        if (imageUrl) updateParams.imageUrl = imageUrl;

        return await updateStudent(existingStudent._id, updateParams);
      }

      return existingStudent;
    }

    // Create new student only when explicitly needed (during enrollment)
    throw new Error(
      'Student does not exist. Create student only during enrollment.'
    );
  } catch (error) {
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

    return student as unknown as Student;
  } catch (error) {
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

    return updatedStudent as unknown as Student;
  } catch (error) {
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

    return deactivatedStudent as unknown as Student;
  } catch (error) {
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

    return reactivatedStudent as unknown as Student;
  } catch (error) {
    throw error;
  }
}

/**
 * Get all students (for admin purposes)
 */
export async function getAllStudents(): Promise<Student[]> {
  try {
    const allStudentsQuery = defineQuery(`
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
      query: allStudentsQuery,
    });

    const students = result?.data || [];

    // Transform the query result to match the Student interface
    return students.map(
      (studentData: {
        _id: string;
        clerkId: string | null;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        imageUrl: string | null;
        isActive: boolean | null;
        createdAt: string | null;
        updatedAt: string | null;
      }) => {
        const student: {
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
        } = {
          _id: studentData._id,
          _type: 'student' as const,
          clerkId: studentData.clerkId || '',
          email: studentData.email || '',
          isActive: studentData.isActive || false,
          createdAt: studentData.createdAt || new Date().toISOString(),
          updatedAt: studentData.updatedAt || new Date().toISOString(),
        };

        if (studentData.firstName) student.firstName = studentData.firstName;
        if (studentData.lastName) student.lastName = studentData.lastName;
        if (studentData.imageUrl) student.imageUrl = studentData.imageUrl;

        return student;
      }
    );
  } catch {
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
  } catch {
    return {
      totalStudents: 0,
      activeStudents: 0,
      inactiveStudents: 0,
    };
  }
}
