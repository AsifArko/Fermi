# -------- Base Stage --------
  FROM node:20-alpine AS base
  WORKDIR /app
  COPY package.json package-lock.json ./
  RUN npm ci
  COPY . .
  
  # -------- Next.js Build Stage --------
  FROM base AS nextjs-build
  
  # Accept build-time environment variables for Next.js
  ARG NEXT_PUBLIC_SANITY_PROJECT_ID
  ARG NEXT_PUBLIC_SANITY_DATASET
  ARG SANITY_API_TOKEN
  ARG SANITY_API_ADMIN_TOKEN
  ARG SANITY_STUDIO_PROJECT_ID
  ARG SANITY_STUDIO_DATASET
  ARG NEXT_PUBLIC_BASE_URL
  ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ARG STRIPE_SECRET_KEY
  ARG STRIPE_WEBHOOK_SECRET
  ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  ARG CLERK_SECRET_KEY
  
  # Write envs to .env.local for Next.js build
  RUN echo "NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID" >> .env.local && \
      echo "NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET" >> .env.local && \
      echo "SANITY_API_TOKEN=$SANITY_API_TOKEN" >> .env.local && \
      echo "SANITY_API_ADMIN_TOKEN=$SANITY_API_ADMIN_TOKEN" >> .env.local && \
      echo "SANITY_STUDIO_PROJECT_ID=$SANITY_STUDIO_PROJECT_ID" >> .env.local && \
      echo "SANITY_STUDIO_DATASET=$SANITY_STUDIO_DATASET" >> .env.local && \
      echo "NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL" >> .env.local && \
      echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" >> .env.local && \
      echo "STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY" >> .env.local && \
      echo "STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET" >> .env.local && \
      echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" >> .env.local && \
      echo "CLERK_SECRET_KEY=$CLERK_SECRET_KEY" >> .env.local
  
  RUN npm run build
  
  # -------- Next.js Production Runner --------
  FROM node:20-alpine AS nextjs-runner
  WORKDIR /app
  COPY --from=nextjs-build /app ./
  EXPOSE 3000
  CMD ["npm", "start"]
  
  # -------- Sanity Studio Runner --------
  FROM node:20-alpine AS sanity-runner
  WORKDIR /app
  COPY --from=base /app ./
  EXPOSE 3333
  # IMPORTANT: Use npx sanity start with the correct path to your studio
  CMD ["npx", "sanity", "start", "src/app/(admin)/studio"]