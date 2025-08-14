# Phase 1: Code Cleanup & Unused Import Removal

## Objectives

- Remove all unused imports and dead code
- Clean up duplicate components
- Optimize bundle size
- Improve code maintainability

## Current Issues Identified

### 1. Duplicate Course Card Components

- `CourseCardBase.tsx` (186 lines) - Main implementation
- `CourseCardFeatured.tsx` (25 lines) - Wrapper
- `CourseCardHome.tsx` (25 lines) - Wrapper
- `CourseCardDashboard.tsx` (25 lines) - Wrapper
- `CourseCardMyCourses.tsx` (28 lines) - Wrapper
- `CourseCardSearch.tsx` (25 lines) - Wrapper
- `ResponsiveCourseCard.tsx` (26 lines) - Wrapper
- `MobileCourseCard.tsx` - Mobile wrapper
- `DesktopCourseCard.tsx` - Desktop wrapper

**Problem**: 9 different card components doing essentially the same thing with minimal variations.

### 2. Component Organization Issues

- Mixed component locations (`src/components/cards/`, `src/components/mobile/`, `src/components/desktop/`)
- Inconsistent import/export patterns
- Duplicate functionality across components

### 3. Unused Dependencies

- `styled-components` - Not actively used
- `react-is` - Potentially unused
- `react-jupyter-notebook` - Usage unclear
- `react-player` - Usage unclear

## Action Plan

### Step 1: Audit Unused Imports

```bash
# Install and run dependency cruiser
npm install -D dependency-cruiser
npx depcruise --config .dependency-cruiser.js src
```

### Step 2: Remove Duplicate Components

- Consolidate all course card variants into single `CourseCard` component
- Use props for variant-specific styling
- Remove redundant wrapper components

### Step 3: Clean Up Component Structure

- Reorganize components by feature, not by device type
- Create proper component hierarchy
- Implement consistent naming conventions

### Step 4: Remove Dead Code

- Delete unused component files
- Remove unused utility functions
- Clean up unused CSS classes

## Expected Outcomes

- **Bundle Size Reduction**: 15-25%
- **Component Count**: Reduce from 9 card components to 1
- **Maintainability**: Significantly improved
- **Performance**: Faster build times

## Files to Modify

- `src/components/cards/*` - Consolidate all card components
- `src/components/mobile/*` - Remove device-specific wrappers
- `src/components/desktop/*` - Remove device-specific wrappers
- `package.json` - Remove unused dependencies

## Success Criteria

- [ ] No duplicate component functionality
- [ ] All unused imports removed
- [ ] Bundle size reduced by at least 15%
- [ ] Single source of truth for course cards
- [ ] Clean component hierarchy established
