# Component Architecture - New System Design

## 🏗️ Component Hierarchy

```
src/
├── components/
│   ├── layout/           # Layout & Structure Components
│   │   ├── Container.tsx
│   │   ├── PageLayout.tsx
│   │   ├── Grid.tsx
│   │   ├── Section.tsx
│   │   └── Spacing.tsx
│   │
│   ├── hero/            # Hero Section Components
│   │   ├── HeroBase.tsx
│   │   ├── HeroHome.tsx
│   │   └── HeroPage.tsx
│   │
│   ├── cards/           # Course Card Components
│   │   ├── CourseCardBase.tsx
│   │   ├── CourseCardHome.tsx
│   │   ├── CourseCardDashboard.tsx
│   │   └── CourseCardSearch.tsx
│   │
│   ├── progress/        # Progress Display Components
│   │   ├── ProgressBadge.tsx
│   │   ├── ProgressBar.tsx
│   │   └── ProgressCard.tsx
│   │
│   └── ui/              # Base UI Components
│       ├── Card.tsx
│       ├── Button.tsx
│       └── Image.tsx
```

## 🔧 Core Components

### **1. Container System**

#### **Container.tsx**

```tsx
interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '7xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

// Usage: Provides consistent width and padding across all components
<Container maxWidth="7xl" padding="lg">
  <Hero />
  <CourseGrid />
</Container>;
```

#### **PageLayout.tsx**

```tsx
interface PageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

// Usage: Standard page wrapper with consistent spacing
<PageLayout>
  <Hero />
  <MainContent />
</PageLayout>;
```

### **2. Hero System**

#### **HeroBase.tsx**

```tsx
interface HeroBaseProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: HeroAction[];
  variant?: 'default' | 'compact' | 'minimal';
  background?: 'none' | 'subtle' | 'animated';
  className?: string;
}

interface HeroAction {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}
```

#### **HeroHome.tsx**

```tsx
// Specialized hero for homepage with specific styling and behavior
export function HeroHome() {
  return (
    <HeroBase
      title="Advance Your Knowledge with Fermi"
      description="Explore expert-led courses in Quantum Computing, Machine Learning, Software Engineering, and Computer Science designed to accelerate your learning and career."
      actions={[
        { text: 'Explore Courses', variant: 'primary' },
        { text: 'About us', href: '/about', variant: 'secondary' },
      ]}
      variant="compact"
      background="subtle"
      className="mb-8"
    />
  );
}
```

### **3. Course Card System**

#### **CourseCardBase.tsx**

```tsx
interface CourseCardBaseProps {
  course: Course;
  variant?: 'home' | 'dashboard' | 'search';
  showProgress?: boolean;
  progressDisplay?: 'badge' | 'bar' | 'card';
  className?: string;
}

// Base card with consistent structure, styling, and behavior
export function CourseCardBase({ course, variant = 'home', ...props }) {
  return (
    <Card className={cn(cardVariants[variant], props.className)}>
      <CardImage course={course} />
      <CardContent>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
        <CardFooter>
          <CourseMeta course={course} />
          {props.showProgress && <ProgressDisplay {...props} />}
        </CardFooter>
      </CardContent>
    </Card>
  );
}
```

#### **Specialized Variants**

```tsx
// Homepage variant - minimal, focused on discovery
export function CourseCardHome(props: CourseCardBaseProps) {
  return <CourseCardBase {...props} variant="home" showProgress={false} />;
}

// Dashboard variant - shows progress, focused on learning
export function CourseCardDashboard(props: CourseCardBaseProps) {
  return (
    <CourseCardBase
      {...props}
      variant="dashboard"
      showProgress={true}
      progressDisplay="badge"
    />
  );
}
```

### **4. Progress Display System**

#### **ProgressBadge.tsx**

```tsx
interface ProgressBadgeProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning';
  showPercentage?: boolean;
  className?: string;
}

// Compact progress indicator for cards
export function ProgressBadge({ progress, size = 'md', ...props }) {
  return (
    <div className={cn(badgeVariants[size], props.className)}>
      <div className="progress-circle" style={{ '--progress': `${progress}%` }}>
        <span className="progress-text">{progress}%</span>
      </div>
    </div>
  );
}
```

#### **ProgressBar.tsx**

```tsx
// Full progress bar for detailed views
export function ProgressBar({ progress, label, ...props }) {
  return (
    <div className="progress-container">
      {label && <span className="progress-label">{label}</span>}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <span className="progress-percentage">{progress}%</span>
    </div>
  );
}
```

## 🎨 Design System

### **Spacing Scale**

```tsx
const spacing = {
  xs: '0.5rem', // 8px
  sm: '1rem', // 16px
  md: '1.5rem', // 24px
  lg: '2rem', // 32px
  xl: '3rem', // 48px
  '2xl': '4rem', // 64px
} as const;
```

### **Container Widths**

```tsx
const containerWidths = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '7xl': '1280px', // Match current max-w-7xl
} as const;
```

### **Card Variants**

```tsx
const cardVariants = {
  home: 'h-[400px] sm:h-[450px]',
  dashboard: 'h-[500px] sm:h-[540px]',
  search: 'h-[450px] sm:h-[500px]',
} as const;
```

## 🔄 Component Relationships

### **Data Flow**

```
Page Component → PageLayout → Container → Hero/CourseGrid
                                    ↓
                              CourseCard → ProgressDisplay
```

### **Props Flow**

```
CourseCardBase ← CourseCardHome/Dashboard/Search
      ↓
ProgressDisplay ← ProgressBadge/Bar/Card
```

### **State Management**

- **Local State**: Component-specific state (hover, focus)
- **Props State**: Data passed from parent components
- **Context State**: Theme, user preferences (if needed)

## 📱 Responsive Strategy

### **Breakpoint System**

```tsx
const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
```

### **Responsive Patterns**

- **Mobile First**: Design for mobile, enhance for larger screens
- **Fluid Typography**: Scale text sizes smoothly between breakpoints
- **Adaptive Layouts**: Change layout structure at appropriate breakpoints
- **Touch Friendly**: Ensure all interactive elements work on touch devices

## 🎯 Implementation Priority

### **Phase 1 (Week 1)**

1. Container system
2. HeroBase component
3. CourseCardBase component

### **Phase 2 (Week 2)**

1. Specialized variants
2. Progress display system
3. Layout components

### **Phase 3 (Week 3)**

1. Page updates
2. Testing and refinement
3. Performance optimization
