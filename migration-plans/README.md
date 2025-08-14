# New Enrollment System - Implementation Guide

## Overview

This document describes the new enrollment system that replaces the old flawed implementation with a robust, modular, and maintainable solution.

## Key Changes

### 1. Architecture Improvements

- **Clear Separation**: Authentication (Clerk) ≠ Enrollment (Sanity)
- **Service Layer**: Modular services for enrollment, student, and course access management
- **State Management**: Explicit enrollment states (pending, active, completed, cancelled)
- **Better Validation**: Comprehensive business rule validation

### 2. New Components

- `EnrollButton`: Enhanced enrollment button with better state management
- `EnrollmentStatusBadge`: Visual status indicators
- `EnrollmentManager`: Central enrollment state management (future enhancement)

### 3. New Services

- `EnrollmentService`: Handles all enrollment operations
- `StudentService`: Manages student lifecycle
- `CourseAccessService`: Validates course access permissions

## File Structure

```
src/
├── components/
│   └── enrollment/
│       ├── EnrollButton.tsx          # Main enrollment button
│       ├── EnrollmentStatusBadge.tsx # Status indicators
│       └── index.ts                  # Exports
├── sanity/
│   ├── lib/
│   │   ├── enrollment/
│   │   │   └── enrollmentService.ts  # Enrollment operations
│   │   ├── student/
│   │   │   └── studentService.ts     # Student management
│   │   └── course/
│   │       └── courseAccessService.ts # Access validation
│   └── schemaTypes/
│       ├── enrollmentType.tsx        # Updated schema
│       └── studentType.tsx           # Updated schema
├── actions/
│   └── enrollmentActions.ts          # Server actions
└── scripts/
    └── migrate-enrollment-schema.ts  # Migration script
```

## Usage Examples

### Basic Enrollment Button

```tsx
import { EnrollButton } from '@/components/enrollment';

<EnrollButton
  courseId="course-123"
  courseSlug="introduction-to-quantum-computing"
  coursePrice={0} // Free course
  variant="hero"
/>;
```

### Enrollment Status Badge

```tsx
import { EnrollmentStatusBadge } from '@/components/enrollment';

<EnrollmentStatusBadge status="active" />
<EnrollmentStatusBadge status="pending" variant="compact" />
```

### Server Actions

```tsx
import {
  enrollInFreeCourse,
  getEnrollmentStatusAction,
} from '@/actions/enrollmentActions';

// Enroll in free course
const result = await enrollInFreeCourse({
  courseId: 'course-123',
  userId: 'user-456',
  metadata: { enrollmentSource: 'web' },
});

// Get enrollment status
const status = await getEnrollmentStatusAction('course-123', 'user-456');
```

## Migration Process

### 1. Schema Updates

The Sanity schemas have been updated with new fields:

- **Enrollment**: Added `status`, `expiresAt`, `metadata`
- **Student**: Added `isActive`, `createdAt`, `updatedAt`

### 2. Data Migration

Run the migration script to update existing data:

```bash
npm run migrate:enrollment
# or
npx tsx scripts/migrate-enrollment-schema.ts
```

### 3. Component Updates

Replace old `EnrollButton` usage with new component:

```tsx
// Old
<EnrollButton courseId={course._id} isEnrolled={isEnrolled} />

// New
<EnrollButton
  courseId={course._id}
  courseSlug={course.slug?.current}
  coursePrice={course.price || 0}
  variant="hero"
/>
```

## Enrollment States

### 1. Pending

- User has initiated enrollment but payment/approval is pending
- Cannot access course content
- Can cancel enrollment

### 2. Active

- User is fully enrolled and can access course
- Normal learning state
- Can complete lessons

### 3. Completed

- User has finished the course
- Can still access content for review
- Achievement unlocked

### 4. Cancelled

- Enrollment was cancelled or expired
- Cannot access course content
- Can re-enroll if eligible

## Access Levels

### 1. None

- No access to course content
- Can view course preview

### 2. Preview

- Limited access (course description, preview)
- Cannot access lessons or materials

### 3. Full

- Complete access to course content
- Can enroll, learn, and complete

### 4. Admin

- Administrative access (future enhancement)

## Business Rules

### 1. Student Creation

- Students are only created when they actually enroll
- No automatic student creation on authentication
- Student records are updated when information changes

### 2. Enrollment Validation

- Cannot enroll if already enrolled (active/completed)
- Cannot enroll if enrollment is pending
- Free courses bypass payment flow
- Paid courses require Stripe checkout (future implementation)

### 3. Access Control

- Access is determined by enrollment status
- Expired enrollments lose access
- Cancelled enrollments can re-enroll

## Error Handling

### 1. Client-Side

- Loading states for all async operations
- Error messages for failed operations
- Retry mechanisms for transient failures

### 2. Server-Side

- Comprehensive error logging
- Structured error responses
- Graceful degradation

## Performance Considerations

### 1. Caching

- Enrollment status is cached per user/course
- Batch enrollment queries for multiple courses
- Optimistic updates for better UX

### 2. Database Queries

- Efficient GROQ queries with proper indexing
- Minimal database round trips
- Connection pooling

## Testing

### 1. Unit Tests

- Service layer functions
- Component rendering
- State management

### 2. Integration Tests

- Enrollment flow end-to-end
- API endpoint validation
- Database operations

### 3. E2E Tests

- Complete user enrollment journey
- Error scenarios
- Edge cases

## Future Enhancements

### 1. Advanced Features

- Enrollment expiration management
- Bulk enrollment operations
- Enrollment analytics and reporting
- Referral system integration

### 2. Performance Improvements

- Redis caching layer
- Background job processing
- Real-time enrollment updates

### 3. Admin Features

- Enrollment management dashboard
- Bulk operations
- Advanced reporting

## Troubleshooting

### Common Issues

#### 1. Enrollment Status Not Updating

- Check if user is authenticated
- Verify course ID is correct
- Check browser console for errors
- Use refresh button to reload state

#### 2. Migration Failures

- Ensure `SANITY_API_TOKEN` has write access
- Check network connectivity
- Verify environment variables
- Review migration logs

#### 3. Component Not Rendering

- Check import paths
- Verify component props
- Check for TypeScript errors
- Ensure dependencies are installed

### Debug Mode

Enable debug logging by setting:

```bash
NODE_ENV=development
DEBUG=enrollment:*
```

## Support

For issues or questions:

1. Check this documentation
2. Review migration logs
3. Check browser console for errors
4. Verify environment configuration
5. Contact development team

## Changelog

### v2.0.0 - Complete Redesign

- New enrollment architecture
- Enhanced component system
- Improved error handling
- Better state management
- Comprehensive validation

### v1.0.0 - Legacy System

- Basic enrollment functionality
- Simple state management
- Limited error handling
- Tight coupling issues
