import Image from 'next/image';
import { defineType, defineField } from 'sanity';

export const enrollmentType = defineType({
  name: 'enrollment',
  title: 'Enrollment',
  type: 'document',
  fields: [
    defineField({
      name: 'student',
      title: 'Student',
      type: 'reference',
      to: [{ type: 'student' }],
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'course',
      title: 'Course',
      type: 'reference',
      to: [{ type: 'course' }],
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Enrollment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Active', value: 'active' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      validation: rule => rule.required(),
      initialValue: 'pending',
    }),
    defineField({
      name: 'amount',
      title: 'Amount',
      type: 'number',
      validation: rule => rule.min(0),
      description: 'Amount in cents',
    }),
    defineField({
      name: 'paymentId',
      title: 'Payment ID',
      type: 'string',
      description: 'ID of the payment in Stripe (optional for free courses)',
    }),
    defineField({
      name: 'enrolledAt',
      title: 'Enrolled At',
      type: 'datetime',
      initialValue: new Date().toISOString(),
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
      description: 'Optional expiration date for the enrollment',
    }),
    defineField({
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      description: 'Additional enrollment data',
      fields: [
        defineField({
          name: 'enrollmentSource',
          title: 'Enrollment Source',
          type: 'string',
          description: 'How the user enrolled (web, mobile, admin, etc.)',
        }),
        defineField({
          name: 'referralCode',
          title: 'Referral Code',
          type: 'string',
          description: 'Referral code used during enrollment',
        }),
        defineField({
          name: 'campaign',
          title: 'Campaign',
          type: 'string',
          description: 'Marketing campaign that led to enrollment',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      courseTitle: 'course.title',
      studentFirstName: 'student.firstName',
      studentLastName: 'student.lastName',
      studentImage: 'student.imageUrl',
      status: 'status',
      amount: 'amount',
    },
    prepare({
      courseTitle,
      studentFirstName,
      studentLastName,
      studentImage,
      status,
      amount,
    }) {
      const displayName =
        studentFirstName && studentLastName
          ? `${studentFirstName} ${studentLastName}`
          : 'Unknown Student';

      const priceDisplay =
        amount === 0 ? 'Free' : `$${(amount / 100).toFixed(2)}`;

      return {
        title: displayName,
        subtitle: `${courseTitle} - ${status} (${priceDisplay})`,
        media: studentImage ? (
          <Image
            src={studentImage}
            alt={displayName}
            width={100}
            height={100}
          />
        ) : undefined,
      };
    },
  },
});
