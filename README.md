This is a e-learning platform built with [Next.js](https://nextjs.org). The project created with `npx create-next-app` command. The authentication of this project is handled by [Clerk](https://clerk.com/), [Sanity](https://www.sanity.io/) is used for the backend and [Stripe](https://www.stripe.com) is used for payment.

## Features

### For Students

- 📚 Access to comprehensive course content
- 📊 Real-time progress tracking
- ✅ Lesson completion system
- 🎯 Module-based learning paths
- 🎥 Multiple video player integrations (YouTube, Vimeo, Loom)
- 💳 Secure course purchases
- 📱 Mobile-friendly learning experience
- 🔄 Course progress synchronization

### For Course Creators

- 📝 Rich content management with Sanity CMS
- 📊 Student progress monitoring
- 📈 Course analytics
- 🎨 Customizable course structure
- 📹 Multiple video hosting options
- 💰 Direct payments via Stripe
- 🔄 Real-time content updates
- 📱 Mobile-optimized content delivery

### Technical Features

- 🚀 Server Components & Server Actions
- 👤 Authentication with Clerk
- 💳 Payment processing with Stripe
- 📝 Content management with Sanity CMS
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 📱 Responsive design
- 🔄 Real-time content updates
- 🔒 Protected routes and content
- 🌙 Dark mode support

### UI/UX Features

- 🎯 Modern, clean interface
- 🎨 Consistent design system using shadcn/ui
- ♿ Accessible components
- 🎭 Smooth transitions and animations
- 📱 Responsive across all devices
- 🔄 Loading states with skeleton loaders
- 💫 Micro-interactions for better engagement
- 🌙 Dark/Light mode toggle

## Getting Started

### Prerequisites

- NodeJs [v22.12.0]
- Npm [v11.2.0]
- Next [v15.3.5]
- Clerk Account
- Sanity Account
- Stripe Account

```

Run `cp .env.example .env.local` and then follow the further instrusctions to update the values of environment variables. Example

```

# Sanity

NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production

# Read Token

SANITY_API_TOKEN=your-sanity-read-token

# Full Access Admin Token

SANITY_API_ADMIN_TOKEN=your-sanity-admin-token

# For Sanity Studio to read

SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production

# Next

NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Clerk

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key

```

## Get Clerk environment variables

Go to [clerk dashboard](https://dashboard.clerk.com/), create an clerk application, navigate to the application overview page. The url should look like this `https://dashboard.clerk.com/apps/app_id/instances/ins_id/api-keys`. Look for `API keys` in the `Configure` tab of the clerk application you've just created

## Get sanity environment variables and configuration information

- Go to [sanity.io](https://sanity.io) and create a sanity application. You should get the `project-id` dataset `production` by default, after creating the project in sanity.io.

- Run `npm create sanity@latest -- --project project-id --dataset production --template clean`. Sanity backend files are placed in `src/sanity`.

- Login to sanity backend with Sanity-CLI with `sanity login` and run `sanity manage` to go to the project console in the browser.

- Go to https://www.sanity.io/organizations/organization-id/project/project-id/api, create `ADMIN_TOKEN` with `Editor` permission and set that token to `SANITY_API_ADMIN_TOKEN` environment variable. Replace the organization-id and project-id with your organization-id and project-id in the url.

- Create `READ_ONLY_TOKEN` with `Viewer` permission and set that token to SANITY_API_TOKEN environment variable.

If you update sanity schemas and libraries located in `/src/sanity/`, you need to run `npm run typegen` to sync your latest changes with the sanity dashboard on the browser.

## Get stripe environment variables and configuration information

- Go to [stripe dashboard](https://dashboard.stripe.com/) and create a stripe application. Upon creation you should get `Publishable Key` and `Secret Key`, set them in the `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` environment variables respectively.

- For the `STRIPE_WEBHOOK_SECRET` to work with the local environment you can run `stripe listen --forward-to localhost:3000/api/stripe/webhook` and for vercel production url, you will have to create a webhook event destination for event `Checkout` session `checkout.session.completed`.

- The `Endpoint URL` should be the vercel producion url with the following signature `https://vercel-project-name.vercel.app/api/stripe/webhook`. The suffix of this url `/api/stripe/webhook` refering the the stripe backend processing in `/src/app/api/stripe/webhook/route.ts` file.

Once you have added all your environment variable you can start installing the depencies.

## Install dependencies

Install the dependencies with `npm install`

## Run the application

To build the application run `npm run build` and start the application with `npm start`. Use `npm run dev` to run the application in dev mode.

Teachers portal: [localhost:3000/studio](http://localhost:3000/studio)
Students portal: [localhost:3000](http://localhost:3000)

## Deployment

Install the vercel cli with `npm i -g vercel` then login to your vercel account with `vercel login`. Then in the browser go to [Vercel](https://vercel.com/), create a vercel project.
Go to `https://vercel.com/your-project/settings/environment-variables` and add your environment variables to your project. Then finally you can deply with `vercel`. You can see the deployments at https://vercel.com/your-project/deployments. The deployed url should have the following signature `https://your-project.vercel.app/`.


## Architecture

### Content Schema

- Courses
  - Title
  - Description
  - Price
  - Image
  - Modules
  - Instructor
  - Category

- Modules
  - Title
  - Lessons
  - Order

- Lessons
  - Title
  - Description
  - Video URL
  - Content (Rich Text)
  - Completion Status

- Students
  - Profile Information
  - Enrolled Courses
  - Progress Data

- Instructors
  - Name
  - Bio
  - Photo
  - Courses

### Key Components

- Course Management System
  - Content creation and organization
  - Module and lesson structuring
  - Rich text editing
  - Media integration

- Progress Tracking
  - Lesson completion
  - Course progress calculation
  - Module progress visualization

- Payment Processing
  - Secure checkout
  - Course enrollment
  - Stripe integration

- User Authentication
  - Clerk authentication
  - Protected routes
  - User roles

## Usage

### Creating a Course

1. Access Sanity Studio
2. Create course structure with modules and lessons
3. Add content and media
4. Publish course

### Student Experience

1. Browse available courses
2. Purchase and enroll in courses
3. Access course content
4. Track progress through modules
5. Mark lessons as complete
6. View completion certificates

## Development

### Key Files and Directories

```

/app # Next.js app directory
/(dashboard) # Dashboard routes
/(user) # User routes
/api # API routes
/components # React components
/sanity # Sanity configuration
/lib # Sanity utility functions
/schemas # Content schemas
/lib # Utility functions

```

### Core Technologies

- Next.js 15
- TypeScript
- Sanity CMS
- Stripe Payments
- Clerk Authentication
- Tailwind CSS
- Shadcn UI
- Lucide Icons

## Features in Detail

### Course Management

- Flexible course structure with modules and lessons
- Rich text editor for lesson content
- Support for multiple video providers
- Course pricing and enrollment management

### Student Dashboard

- Progress tracking across all enrolled courses
- Lesson completion status
- Continue where you left off
- Course navigation with sidebar

### Video Integration

- URL Video Player
- Loom Embed Support
- Responsive video playback

### Payment System

- Secure Stripe checkout
- Course access management
- Webhook integration
- Payment status tracking

### Authentication

- User registration and login
- Protected course content
- Role-based access control
- Secure session management

### UI Components

- Modern, responsive design
- Loading states and animations
- Progress indicators
- Toast notifications
- Modal dialogs

## Current Issues

The `Mark as Complete` button toggle and the respective sidebar component update feature doesn't behave properly when a build is run instead of dev mode. In dev mode it works perfectly.

## Todo

Fix the button issue first, then may be work on the structure tool. The current one is not good enough for comprehensive content writing, clean up.
```
