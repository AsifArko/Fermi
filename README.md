# Fermi E-Learning Platform (Prototype)

Fermi is a full-stack e-learning platform built with **Next.js 15**, **Sanity Studio (embedded)**, **Clerk authentication**, and **Stripe payments**. It supports student course consumption, creator/admin content management, enrollment and lesson progress tracking, and real-time analytics/monitoring.

**Authors:** Sadia Afrin Purba & Asif Imtiyaz Chowdhury  
**Email:** purba0101@gmail.com & asif.imch@gmail.com

> **Co-Authorship:** This software is co-authored by both partners, ensuring equal rights and privileges for both authors.

## Features (high level)

- **Student experience:** Browse courses, view detailed outlines, enroll, watch lessons, and track completion progress.
- **Creator/admin experience:** Embedded Sanity Studio at `/studio` plus an asset manager at `/studio/asset-manager`.
- **Content model:** Courses, categories, modules, lessons, instructors, students, enrollments, lesson completion, and monitoring entities.
- **Payments:** Stripe checkout session creation and webhook handling for enrollment flow.
- **Observability:** Monitoring APIs, analytics dashboards, health checks, and Prometheus-compatible metrics endpoints.
- **Modern stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS 4, Radix UI, shadcn/ui, Jest, ESLint, Prettier.

## Screenshot gallery

Browse the UI quickly below. Click any thumbnail to open the full-size image.

| Screen 01 | Screen 02 | Screen 03 |
|---|---|---|
| [![Fermi app screenshot 01](./screenshots/1%20-%20Homepage.png)](./screenshots/1%20-%20Homepage.png) | [![Fermi app screenshot 02](./screenshots/2%20-%20Course%20Outline.png)](./screenshots/2%20-%20Course%20Outline.png) | [![Fermi app screenshot 03](./screenshots/3%20-%20Course%20Library%20(media).png)](./screenshots/3%20-%20Course%20Library%20(media).png) |

| Screen 04 | Screen 05 | Screen 06 |
|---|---|---|
| [![Fermi app screenshot 04](./screenshots/4%20-%20Course%20Library%20(media-docs).png)](./screenshots/4%20-%20Course%20Library%20(media-docs).png) | [![Fermi app screenshot 05](./screenshots/5%20-%20Course%20Library%20(media-code).png)](./screenshots/5%20-%20Course%20Library%20(media-code).png) | [![Fermi app screenshot 06](./screenshots/6%20-%20Course%20Library%20(media-notebook).png)](./screenshots/6%20-%20Course%20Library%20(media-notebook).png) |

| Screen 07 | Screen 08 | Screen 09 |
|---|---|---|
| [![Fermi app screenshot 07](./screenshots/7%20-%20Studio%20(Dashboard).png)](./screenshots/7%20-%20Studio%20(Dashboard).png) | [![Fermi app screenshot 08](./screenshots/8%20-%20Studio%20(analytics).png)](./screenshots/8%20-%20Studio%20(analytics).png) | [![Fermi app screenshot 09](./screenshots/9%20-%20System%20Monitoring.png)](./screenshots/9%20-%20System%20Monitoring.png) |

| Screen 10 | Screen 11 | Screen 12 |
|---|---|---|
| [![Fermi app screenshot 10](./screenshots/10%20-%20Create%20Course.png)](./screenshots/10%20-%20Create%20Course.png) | [![Fermi app screenshot 11](./screenshots/11%20-%20Create%20Categories.png)](./screenshots/11%20-%20Create%20Categories.png) | [![Fermi app screenshot 12](./screenshots/12%20-%20Create%20Modules.png)](./screenshots/12%20-%20Create%20Modules.png) |

| Screen 13 | Screen 14 | Screen 15 |
|---|---|---|
| [![Fermi app screenshot 13](./screenshots/13%20-%20Create%20Lessons.png)](./screenshots/13%20-%20Create%20Lessons.png) | [![Fermi app screenshot 14](./screenshots/14%20-%20Instructors.png)](./screenshots/14%20-%20Instructors.png) | [![Fermi app screenshot 15](./screenshots/15%20-%20Students.png)](./screenshots/15%20-%20Students.png) |

| Screen 16 |
|---|
| [![Fermi app screenshot 16](./screenshots/16%20-%20Enrollments.png)](./screenshots/16%20-%20Enrollments.png) |

## Repository layout

| Path | Role |
|------|------|
| `src/app/` | Next.js App Router pages, layouts, route handlers |
| `src/app/(user)/` | Public user-facing pages (`/`, course pages, search, about, contact, etc.) |
| `src/app/(dashboard)/` | Authenticated course dashboard and analytics |
| `src/app/(admin)/studio/` | Embedded Sanity Studio and asset manager |
| `src/app/api/` | API routes (Stripe, health/metrics, monitoring, analytics, files, draft-mode) |
| `src/actions/` | Server actions for enrollments and lesson completion |
| `src/sanity/` | Sanity schema types, structure, client/env utilities |
| `src/components/` | UI components and feature modules |
| `src/__tests__/` | Jest tests |
| `scripts/` | Utility scripts for migration, purge, deployment, rollback |
| `monitoring/` | Prometheus config and Grafana dashboard JSON |

## Core routes and modules

### User-facing routes

- `/` homepage with course listing.
- `/courses/[slug]` course detail and enrollment entry.
- `/my-courses` enrolled courses view.
- `/search`, `/about`, `/contact`, `/privacy-policy`.

### Dashboard/admin routes

- `/dashboard/courses/[courseId]` learning dashboard.
- `/dashboard/courses/[courseId]/lessons/[lessonId]` lesson experience.
- `/dashboard/analytics` analytics dashboard.
- `/studio/[[...tool]]` embedded Sanity Studio.
- `/studio/asset-manager` media/file management.

### API surface (selected)

- **Payments:** `/api/stripe/webhook`
- **Monitoring/analytics:** `/api/monitoring/*`, `/api/analytics/*`
- **Platform health:** `/api/health`, `/api/metrics`
- **Preview/draft mode:** `/api/draft-mode/enable`, `/api/draft-mode/disable`
- **Asset/file delivery:** `/api/files/[assetId]`

## Prerequisites

- Node.js 22+ and npm
- Sanity project + dataset
- Clerk application
- Stripe account (for paid enrollment flow)
- Docker + Docker Compose (optional, for containerized local/dev/staging/prod)

## Environment setup

Copy and configure environment values:

```bash
cp env.example .env.local
cp env.example .env
```

### Required variables

```env
# App
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=...
SANITY_API_ADMIN_TOKEN=...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

## Local development

Install dependencies and run the app:

```bash
npm install
npm run dev
```

Then open:

- App: [http://localhost:3000](http://localhost:3000)
- Studio: [http://localhost:3000/studio](http://localhost:3000/studio)
- Asset Manager: [http://localhost:3000/studio/asset-manager](http://localhost:3000/studio/asset-manager)

### Sanity type generation

Run after schema changes:

```bash
npm run typegen
```

## Quality checks and tests

```bash
npm run lint
npm run type-check
npm run test
npm run test:coverage
npm run format:check
```

## Build and production run

```bash
npm run build
npm start
```

## Docker workflows

### Development (with Prometheus + Grafana)

```bash
npm run docker:dev
```

Services:

- Next.js: [http://localhost:3000](http://localhost:3000)
- Sanity: [http://localhost:3333](http://localhost:3333)
- Prometheus: [http://localhost:9090](http://localhost:9090)
- Grafana: [http://localhost:3001](http://localhost:3001)

### Staging/production compose flows

```bash
npm run docker:staging
npm run docker:production
```

### Deployment/rollback helpers

```bash
npm run deploy:staging <tag>
npm run deploy:production <tag>
npm run rollback:staging <tag>
npm run rollback:production <tag>
```

## Monitoring and observability

- Monitoring test page: `/test-monitoring`
- Health endpoint: `/api/health`
- Metrics endpoint: `/api/metrics`
- Additional monitoring endpoints: `/api/monitoring/*`

For deeper setup and operations:

- [MONITORING_README.md](./MONITORING_README.md)
- [CI_CD_SETUP.md](./CI_CD_SETUP.md)
- [DEVELOPMENT_TOOLS.md](./DEVELOPMENT_TOOLS.md)

## Data model overview

- **Course**: title, description, price, image, modules, instructor, category
- **Module**: ordered group of lessons
- **Lesson**: content, video/media/files, completion state
- **Enrollment**: student-to-course link and progress tracking
- **Student/Instructor**: profile and relationship metadata
- **Analytics entities**: page views, user events, system and performance metrics, error logs

## License

See [`LICENSE`](./LICENSE).
