This is a e-learning platform built with [Next.js](https://nextjs.org) [v15.3.5]. The project created with `npx create-next-app` command.

The original project is done by [Mr. Sonny Sangha] (https://github.com/sonnysangha) but the structure he had were not supporting by vercel. So the application structure is updated a little bit than what it was in his original code, some minor bugs fixed in header, footer has been added. For vercel deployment few adjustments were needed.

## Getting Started

First create `.env.local` and use the following environment variables. First go to [sanity.io](https://sanity.io) and create a project. You should get the `project-id` dataset `production` by default, after creating the project in sanity.io. To do a fresh install of the sanity backend in the source code you need to run `npm create sanity@latest -- --project project-id --dataset production --template clean`. Sanity backend files are placed in `src/sanity`. To login to sanity backend with CLI run `sanity login` and run `sanity manage` to go to the project console in the browser.

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_**
CLERK_SECRET_KEY=sk_test_**

# Sanity configuration
NEXT_PUBLIC_SANITY_PROJECT_ID="project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION=2025-05-31

SANITY_STUDIO_DATASET="production"
SANITY_STUDIO_PROJECT_ID="dqg4qs9m"

SANITY_API_TOKEN=token
SANITY_API_ADMIN_TOKEN=token


# Set this environment variable to support webhooks — https://stripe.com/docs/webhooks#verify-events
STRIPE_WEBHOOK_SECRET=whsec_****
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_**
STRIPE_SECRET_KEY=sk_test_**

```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
