# Phase 2: Component Modularization & Reusability

## Objectives

- Create truly modular, reusable components
- Implement proper component composition patterns
- Maintain UI/UX integrity during refactoring
- Establish component design system

## Current Component Analysis

### 1. Course Card System

**Current State**: 9 separate components with minimal differences
**Target State**: Single `CourseCard` with variant system

```typescript
interface CourseCardProps {
  course: Course;
  variant: 'home' | 'dashboard' | 'search' | 'my-courses';
  showProgress?: boolean;
  showActions?: boolean;
  className?: string;
  onAction?: (action: string, courseId: string) => void;
}
```

### 2. Layout Components

**Current State**: Scattered across multiple directories
**Target State**: Organized by feature and responsibility

```
src/components/
├── layout/           # Page layout components
├── ui/              # Reusable UI primitives
├── features/        # Feature-specific components
│   ├── courses/     # Course-related components
│   ├── lessons/     # Lesson-related components
│   └── auth/        # Authentication components
└── shared/          # Cross-cutting components
```

### 3. Component Composition Strategy

#### A. Atomic Design Principles

- **Atoms**: Buttons, inputs, badges, icons
- **Molecules**: Form fields, search bars, progress indicators
- **Organisms**: Course cards, lesson lists, navigation
- **Templates**: Page layouts, dashboard layouts
- **Pages**: Specific page implementations

#### B. Props Interface Design

```typescript
// Flexible, composable components
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}
```

## Implementation Plan

### Step 1: Create Component Foundation

1. **Base Components**: Create reusable base components
2. **Variant System**: Implement consistent variant patterns
3. **Composition**: Use composition over inheritance

### Step 2: Refactor Course Cards

1. **Unified Component**: Single `CourseCard` with all variants
2. **Variant Props**: Use props for different display modes
3. **Responsive Design**: Built-in responsive behavior
4. **Performance**: Implement proper memoization

### Step 3: Establish Design System

1. **Typography Scale**: Consistent text sizing
2. **Color System**: Semantic color variables
3. **Spacing Scale**: Consistent spacing units
4. **Animation System**: Standardized transitions

### Step 4: Component Testing

1. **Unit Tests**: Test individual components
2. **Integration Tests**: Test component interactions
3. **Visual Tests**: Ensure UI consistency

## Component Architecture

### 1. Course Card Refactor

```typescript
// Before: 9 separate components
// After: 1 unified component
export function CourseCard({
  course,
  variant = 'default',
  showProgress = false,
  showActions = false,
  className,
  onAction,
  ...props
}: CourseCardProps) {
  const cardVariants = {
    home: 'h-[400px] sm:h-[450px]',
    dashboard: 'h-[500px] sm:h-[540px]',
    search: 'h-[450px] sm:h-[500px]',
    'my-courses': 'h-[350px] sm:h-[400px]'
  };

  const imageVariants = {
    home: 'h-48 sm:h-56',
    dashboard: 'h-56 sm:h-64',
    search: 'h-52 sm:h-60',
    'my-courses': 'h-40 sm:h-48'
  };

  return (
    <div className={cn(cardVariants[variant], className)} {...props}>
      {/* Component content */}
    </div>
  );
}
```

### 2. Responsive Design Integration

- Use CSS Grid and Flexbox for responsive layouts
- Implement container queries for component-level responsiveness
- Remove device-specific wrapper components

### 3. Performance Optimization

- Implement React.memo for expensive components
- Use useMemo and useCallback appropriately
- Lazy load non-critical components

## Expected Outcomes

- **Component Count**: Reduce from 50+ to 25-30 core components
- **Reusability**: 80%+ component reuse across features
- **Maintainability**: Single source of truth for each component type
- **Performance**: Improved rendering performance
- **Developer Experience**: Faster development with reusable components

## Success Criteria

- [ ] Single CourseCard component handles all variants
- [ ] All components follow consistent prop patterns
- [ ] Responsive design built into components
- [ ] Component library established
- [ ] Performance benchmarks met
- [ ] UI/UX remains identical to current state
