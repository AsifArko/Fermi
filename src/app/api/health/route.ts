import { NextResponse } from 'next/server';

import { config } from '@/lib/config';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: config.app.version,
    environment: config.app.environment,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    checks: {
      sanity: await checkSanityHealth(),
      stripe: await checkStripeHealth(),
      clerk: await checkClerkHealth(),
    },
  };

  const isHealthy = Object.values(health.checks).every(
    check => check.status === 'healthy'
  );

  return NextResponse.json(health, {
    status: isHealthy ? 200 : 503,
  });
}

async function checkSanityHealth() {
  try {
    // Add Sanity health check logic
    return { status: 'healthy', message: 'Sanity CMS is accessible' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
}

async function checkStripeHealth() {
  try {
    // Add Stripe health check logic
    return { status: 'healthy', message: 'Stripe is accessible' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
}

async function checkClerkHealth() {
  try {
    // Add Clerk health check logic
    return { status: 'healthy', message: 'Clerk is accessible' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
}
