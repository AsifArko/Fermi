import Image from 'next/image';
import { defineType, defineField } from 'sanity';

export const studentType = defineType({
  name: 'student',
  title: 'Student',
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: rule => rule.required().email(),
    }),
    defineField({
      name: 'clerkId',
      title: 'Clerk User ID',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'imageUrl',
      title: 'Profile Image URL',
      type: 'url',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Whether this student account is active',
      initialValue: true,
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: new Date().toISOString(),
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      initialValue: new Date().toISOString(),
      validation: rule => rule.required(),
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      imageUrl: 'imageUrl',
      isActive: 'isActive',
      email: 'email',
    },
    prepare({ firstName, lastName, imageUrl, isActive, email }) {
      const displayName =
        firstName && lastName
          ? `${firstName} ${lastName}`
          : email || 'Unknown Student';

      const status = isActive ? 'Active' : 'Inactive';

      return {
        title: displayName,
        subtitle: `Student - ${status}`,
        media: imageUrl ? (
          <Image src={imageUrl} alt={displayName} width={100} height={100} />
        ) : undefined,
      };
    },
  },
});
