# Fermi E-Learning Platform

A modern e-learning platform built with [Next.js](https://nextjs.org), [Clerk](https://clerk.com/) for auth, [Sanity](https://sanity.io/) for content, and [Stripe](https://stripe.com) for payments.

---

**Features for Students:**  
• Module-based courses, real-time progress, lesson completion  
• Video: YouTube, Vimeo, Loom  
• Secure purchases, mobile-friendly

**For Creators:**  
• Sanity CMS, analytics, flexible structure, Stripe payments

**Technical:**  
• Next.js 15, Clerk, Stripe, Sanity, Tailwind, shadcn/ui  
• Server Components, protected routes, dark mode

**UI/UX:**  
• Clean, accessible, responsive, micro-interactions, dark/light toggle

---

**Prerequisites:**  
`Node.js v22.12.0` · `npm v11.2.0` · `Next.js v15.3.5`  
Accounts: Clerk, Sanity, Stripe

**Quick Setup:**

1. `cp .env.example .env.local` and fill in your secrets (see below).
2. `npm install`
3. `npm run dev` (or `npm run build && npm start` for production)
4. Sanity Studio: `npm run sanity:dev`

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

**Run:**

- Teachers: [localhost:3000/studio](http://localhost:3000/studio)
- Students: [localhost:3000](http://localhost:3000)

**Deploy:**

1. `npm i -g vercel`
2. `vercel login`
3. [Vercel](https://vercel.com/) → create project
4. Add env vars: `https://vercel.com/<your-project>/settings/environment-variables`
5. `vercel`
6. Deployments: `https://vercel.com/<your-project>/deployments`
7. Live: `https://<your-project>.vercel.app/`

---

**Docker:**

- Prereq: [Docker](https://www.docker.com/get-started), [Docker Compose](https://docs.docker.com/compose/)
- Copy env file to project root
- Build & run: `docker-compose up --build`
- Stop: `docker-compose down`
- Next.js: [localhost:3000](http://localhost:3000)
- Sanity: [localhost:3333](http://localhost:3333)

---

<details>
<summary>Architecture & Content Model</summary>

- **Courses:** Title, Description, Price, Image, Modules, Instructor, Category
- **Modules:** Title, Lessons, Order
- **Lessons:** Title, Description, Video URL, Content, Completion
- **Students:** Profile, Enrollments, Progress
- **Instructors:** Name, Bio, Photo, Courses

</details>

---

**Key Directories:**  
`/app` (Next.js) · `/components` · `/sanity` · `/lib` · `/api` · `/schemas`

---

**Current Issues:**

- "Mark as Complete" button/Sidebar update works in dev, not in production build.

**Todo:**

- Fix button issue
- Improve structure tool for content writing
