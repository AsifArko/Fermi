This is a e-learning platform built with [Next.js](https://nextjs.org). The project created with `npx create-next-app` command. The authentication of this project is handled by [Clerk](https://clerk.com/), [Sanity](https://www.sanity.io/) is used for the backend and [Stripe](https://www.stripe.com) is used for payment.

The original project is done by [Mr. Sonny Sangha] (https://github.com/sonnysangha) currently is not supported by vercel for projects using NextJS version > 13. So the application structure is updated a little bit, some minor bugs fixed in header, footer has been added. For vercel deployment few adjustments were needed.

## Prerequisites

```
[NodeJs](https://wwww.nodejs.org) [v22.12.0]
[NPM] [v11.2.0]
[NextJs] [v15.3.5]
```

## Getting Started

First create `.env.local` and add this configuration initially. Then update the environment variable values as the guide line follows for Clerk, Sanity, Stripe and Vercel.

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Sanity configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=2025-05-31

SANITY_STUDIO_DATASET=
SANITY_STUDIO_PROJECT_ID=

SANITY_API_TOKEN=token
SANITY_API_ADMIN_TOKEN=token

STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Get Clerk environment variables

Go to [clerk dashboard](https://dashboard.clerk.com/), create an clerk application, navigate to the application overview page. The url should look like this `https://dashboard.clerk.com/apps/app_id/instances/ins_id/api-keys`. Look for `API keys` in the `Configure` tab of the clerk application you've just created

## Get sanity environment variables

Go to [sanity.io](https://sanity.io) and create a sanity application. You should get the `project-id` dataset `production` by default, after creating the project in sanity.io. To do a fresh install of the sanity backend in the source code you need to run `npm create sanity@latest -- --project project-id --dataset production --template clean`. Sanity backend files are placed in `src/sanity`. To login to sanity backend with CLI run `sanity login` and run `sanity manage` to go to the project console in the browser. Go to https://www.sanity.io/organizations/organization-id/project/project-id/api, create `ADMIN_TOKEN` with `Editor` permission and set that token to `SANITY_API_ADMIN_TOKEN` environment variable.
Then create `READ_ONLY_TOKEN` with `Viewer` permission and set that token to SANITY_API_TOKEN environment variable. If you update sanity schemas and libraries located in `/src/sanity/`, you will have to run `npm run typegen` to sync your latest changes with the sanity dashboard on the browser.

## Get stripe environment variables

Go to [stripe dashboard](https://dashboard.stripe.com/) and create a stripe application. Upon creation you should get `Publishable Key` and `Secret Key`, set them in the `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` environment variables respectively. For the `STRIPE_WEBHOOK_SECRET` to work with the local environment you can run `stripe listen --forward-to localhost:3000/api/stripe/webhook` and for vercel production url, you will have to create a webhook event destination for event `Checkout` session `checkout.session.completed`. The api version tested for stripe webhook event destination is `(2025-05-28.basil)` which need to be selected as well and then the `Endpoint URL` should be the vercel producion url with the following signature `https://vercel-project-name.vercel.app/api/stripe/webhook`. The suffix of this url `/api/stripe/webhook` refering the the stripe backend processing in `/src/app/api/stripe/webhook/route.ts` file.

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

## Current Issues

The `Mark as Complete` button toggle and the respective sidebar component update feature doesn't behave properly when a build is run instead of dev mode. In dev mode it works perfectly.

## Todo

Fix the button issue first, then may be work on the structure tool. The current one is not good enough for comprehensive content writing, clean up.
