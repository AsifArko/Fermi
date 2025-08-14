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
  // First check if student exists
  const existingStudentQuery = await client.fetch(
    groq`*[_type == "student" && clerkId == $clerkId][0] { _id, clerkId, email }`,
    { clerkId }
  );

  if (existingStudentQuery) {
    return existingStudentQuery;
  }

  // If no student exists, create a new one

  const newStudent = await client.create({
    _type: 'student',
    clerkId,
    email,
    firstName,
    lastName,
    imageUrl,
  });

  return newStudent;
}
