import groq from 'groq';
import { client } from '../adminClient';

interface CreateStudentProps {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

export async function createStudentIfNotExists({
  clerkId,
  email,
  firstName,
  lastName,
  imageUrl,
}: CreateStudentProps) {
  console.log('createStudentIfNotExists called with:', {
    clerkId,
    email,
    firstName,
    lastName,
    imageUrl,
  });

  // First check if student exists
  const existingStudentQuery = await client.fetch(
    groq`*[_type == "student" && clerkId == $clerkId][0]`,
    { clerkId }
  );

  console.log('Existing student query result:', existingStudentQuery);

  if (existingStudentQuery) {
    console.log('Student already exists', existingStudentQuery);
    return existingStudentQuery;
  }

  // If no student exists, create a new one
  console.log('Creating new student...');
  const newStudent = await client.create({
    _type: 'student',
    clerkId,
    email,
    firstName,
    lastName,
    imageUrl,
  });

  console.log('New student created', newStudent);

  return newStudent;
}
