# Fermi E-Learning Platform

A modern e-learning platform built with [Next.js](https://nextjs.org), [Clerk](https://clerk.com/) for auth, [Sanity](https://sanity.io/) for content, and [Stripe](https://stripe.com) for payments. This codebase has been tested in macos and windows many times and in most case one doesn't require making any change to the source code. Both docker and local build should run successfully. On vercel however, I recommend before doing any deployment first add environment variables from settings by uploading .env files for different environments and then deploy.

**Authors:** Sadia Afrin Purba & Asif Imtiyaz Chowdhury  
**Email:** purba0101@gmail.com & asif.imch@gmail.com

> **Co-Authorship:** This software is co-authored by both partners, ensuring equal rights and privileges for both authors.

---

### ✨ Features

#### 🎓 For Students

- **Interactive Learning:** Engage with module-based courses, track your progress in real-time, and access downloadable resource files.
- **Rich Media Content:** Watch lesson videos from YouTube and Loom directly within the platform.
- **Seamless Experience:** Enjoy secure and easy course purchases with a fully mobile-friendly design.
- **Lesson Tracking:** Mark lessons as complete to keep track of your learning journey.

#### 👩‍🏫 For Creators

- **Powerful Content Management:** Use the integrated Sanity CMS to create and manage course content with ease.
- **Flexible Course Structure:** Design courses with custom modules and lessons to fit your teaching style.
- **Monetization:** Accept payments securely through Stripe integration.
- **Rich Media Support:** Upload various media types, including videos, documents, and other files for your lessons.
- **Student Analytics:** Monitor student progress and engagement.

#### 🛠️ Technical Stack

- **Framework:** [Next.js](https://nextjs.org/) 15 (with Server Components)
- **Authentication:** [Clerk](https://clerk.com/) for secure user management and protected routes.
- **CMS:** [Sanity](https://sanity.io/) for flexible and powerful content management.
- **Payments:** [Stripe](https://stripe.com/) for reliable payment processing.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/) for a modern and responsive UI.
- **Dark Mode:** Built-in dark mode support.

#### 🎨 UI/UX

- **Modern Design:** A clean, accessible, and responsive interface.
- **Engaging Interactions:** Thoughtful micro-interactions to enhance the user experience.
- **Theme Toggle:** Easily switch between light and dark modes.

**Prerequisites:**  
`Node.js v22.12.0` · `npm v11.2.0` · `Next.js v15.3.5`  
Accounts: Clerk, Sanity, Stripe

**Quick Setup:**

1. `cp .env.example .env.local && cp .env.example .env` and fill the secrets in both `.env` and `.env.local`

**Run with Docker:**

- Prereq: [Docker](https://www.docker.com/get-started), [Docker Compose](https://docs.docker.com/compose/)
- Copy env file to project root
- Build & run: `docker-compose up --build --no-cache`
- Stop: `docker-compose down`
- Next.js: [localhost:3000](http://localhost:3000)
- Sanity: [localhost:3333](http://localhost:3333)

---

**Run Locally:**

1. `npm install`
2. `npm run typegen` # This should be done while doing sanity configuration.
3. `sanity deploy` # This should be done while doing sanity configuration
4. `npm run dev` (or `npm run build && npm start` for production)

In the browser,

**For Teachers/Creators:**

- Sanity Studio: [localhost:3000/studio](http://localhost:3000/studio)
- Manage courses, lessons, and content
- Upload videos, files, and images
- Monitor student progress

**For Students:**

- Main Portal: [localhost:3000](http://localhost:3000)
- Browse and enroll in courses
- Access lesson content and resources
- Track learning progress
- Complete lessons and earn certificates

---

**Environment Variables:**

<details>
<summary>Click to expand</summary>

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=...
SANITY_API_ADMIN_TOKEN=...
SANITY_STUDIO_PROJECT_ID=...
SANITY_STUDIO_DATASET=production

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

</details>

---

**Sanity Setup:**

1. Create project at [sanity.io](https://sanity.io)
2. `npm install -g @sanity/cli`
3. `npm create sanity@latest -- --project <project-id> --dataset production --template clean`
4. `sanity login` → `sanity manage`
5. Create API tokens (Admin & Read-only) in [Sanity API settings](https://www.sanity.io/organizations/<org-id>/project/<project-id>/api)
6. `npm run typegen`
7. `sanity deploy`

**Clerk Setup:**

1. [Clerk Dashboard](https://dashboard.clerk.com/) → create app
2. Go to **Configure > API Keys** (`/apps/<app_id>/instances/<ins_id>/api-keys`)
3. Add redirect URLs, copy env vars

**Stripe Setup:**

1. [Stripe Dashboard](https://dashboard.stripe.com/) → create app
2. Copy Publishable & Secret Keys to env
3. For webhooks:
   - Local: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
   - Production: set endpoint to `https://<your-vercel-project>.vercel.app/api/stripe/webhook`
   - Set `STRIPE_WEBHOOK_SECRET`
4. Webhook handler: `/src/app/api/stripe/webhook/route.ts`

---

**Deploy:**

1. Install vercel `npm i -g vercel`
2. Login to vercel with `vercel login`, it should take you to the browser
3. [Vercel](https://vercel.com/) → create a project
4. Add env vars: `https://vercel.com/<your-project>/settings/environment-variables`
5. To deploy a preview deployment run `vercel`. For local development server run `vercel dev` and for production deployment run `vercel prod`
6. Deployments: `https://vercel.com/<your-project>/deployments`
7. Live: `https://<your-project>.vercel.app/`

Through out the configuration consistent naming of the applications is recommended among different platforms like Clerk, Sanity, Stripe.

<details>
<summary>Architecture & Content Model</summary>

- **Courses:** Title, Description, Price, Image, Modules, Instructor, Category
- **Modules:** Title, Lessons, Order
- **Lessons:** Title, Description, Video URL, Content, Code, Images, Course Material Files (pdf/docs), Completion
- **Students:** Profile, Enrollments, Progress
- **Instructors:** Name, Bio, Photo, Courses

</details>

---

**Key Directories:**  
`/app` (Next.js) · `/components` · `/sanity` · `/lib` · `/api` · `/schemas`

---
