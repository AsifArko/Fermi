# Quick Start Guide - New Enrollment System

## 🚀 Immediate Testing

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test the New Enrollment System

1. Navigate to any course page: `/courses/[course-slug]`
2. The new `EnrollButton` should now be visible
3. Test with both authenticated and unauthenticated users

### 3. Verify Component Rendering

- **Unauthenticated users**: Should see "Sign in to Enroll" button
- **Authenticated users**: Should see enrollment status and appropriate actions
- **Free courses**: Should show "Enroll Free" button
- **Paid courses**: Should show "Enroll for $X" button

## 🔧 Migration Steps (When Ready)

### 1. Update Sanity Schema

The schemas have been updated in the code. You'll need to:

1. Deploy the schema changes to your Sanity studio
2. Or run the migration script to update existing data

### 2. Run Migration Script

```bash
npm run migrate:enrollment
```

**Prerequisites:**

- Set `SANITY_API_TOKEN` in `.env.local` with write access
- Ensure `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are set

### 3. Verify Migration

Check the console output for:

- ✅ Enrollment migration completed
- ✅ Student migration completed
- ✅ Migration validation completed

## 🧪 Testing Scenarios

### Scenario 1: New User Enrollment

1. Sign out (if signed in)
2. Go to a free course
3. Click "Sign in to Enroll"
4. Complete authentication
5. Verify enrollment button changes to "Enroll Free"
6. Click enroll button
7. Should redirect to dashboard course page

### Scenario 2: Existing User

1. Sign in with existing account
2. Go to a course you're not enrolled in
3. Verify enrollment button shows correctly
4. Test enrollment flow

### Scenario 3: Already Enrolled User

1. Sign in with account that has enrollments
2. Go to enrolled course
3. Should see "Access Course" button
4. Should show enrollment status badge

## 🐛 Troubleshooting

### Common Issues

#### 1. Component Not Rendering

```bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint
```

#### 2. Migration Fails

```bash
# Check environment variables
echo $SANITY_API_TOKEN
echo $NEXT_PUBLIC_SANITY_PROJECT_ID
echo $NEXT_PUBLIC_SANITY_DATASET

# Verify token has write access
```

#### 3. Enrollment Not Working

- Check browser console for errors
- Verify user is authenticated
- Check course ID is correct
- Use refresh button in component

### Debug Mode

Add to `.env.local`:

```bash
DEBUG=enrollment:*
NODE_ENV=development
```

## 📱 Component Variants

### EnrollButton Variants

```tsx
// Default
<EnrollButton courseId="123" coursePrice={0} />

// Compact
<EnrollButton courseId="123" coursePrice={0} variant="compact" />

// Hero (for course pages)
<EnrollButton courseId="123" coursePrice={0} variant="hero" />
```

### Status Badge Variants

```tsx
// Default
<EnrollmentStatusBadge status="active" />

// Compact
<EnrollmentStatusBadge status="active" variant="compact" />

// Alternative styling
<EnrollmentStatusBadgeAlt status="active" />

// Pill style
<EnrollmentStatusPill status="active" />
```

## 🔄 Rollback Plan

If issues arise, you can:

### 1. Revert Components

```bash
# Restore old EnrollButton
git checkout HEAD~1 -- src/components/EnrollButton.tsx
git checkout HEAD~1 -- src/app/\(user\)/courses/\[slug\]/page.tsx
```

### 2. Revert Schemas

```bash
# Restore old schemas
git checkout HEAD~1 -- src/sanity/schemaTypes/enrollmentType.tsx
git checkout HEAD~1 -- src/sanity/schemaTypes/studentType.tsx
```

### 3. Restart Development

```bash
npm run dev
```

## 📊 Expected Behavior

### Before Migration

- Old enrollment system works as before
- New components may show errors or missing data
- Some features may not work correctly

### After Migration

- New enrollment system fully functional
- All enrollment states properly managed
- Better user experience and error handling
- Real-time status updates

### During Migration

- System remains functional
- Gradual data updates
- No downtime for users

## 🎯 Success Criteria

### Component Level

- [ ] EnrollButton renders without errors
- [ ] Status badges display correctly
- [ ] Loading states work properly
- [ ] Error handling functions

### System Level

- [ ] Enrollment flow completes successfully
- [ ] Status updates in real-time
- [ ] No console errors
- [ ] Smooth user experience

### Data Level

- [ ] Migration script runs successfully
- [ ] New fields are populated
- [ ] Existing data is preserved
- [ ] Validation rules work

## 🚨 Emergency Contacts

If critical issues arise:

1. Check this troubleshooting guide
2. Review migration logs
3. Check browser console
4. Verify environment configuration
5. Contact development team

## 📝 Notes

- **Test thoroughly** before running migration
- **Backup data** if possible
- **Monitor closely** during migration
- **Have rollback plan** ready
- **Document any issues** encountered

The new system is designed to be robust and backward compatible, but thorough testing is essential before full deployment.
