import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import stripe, { Stripe } from 'stripe';

import { createEnrollment } from '@/sanity/lib/student/createEnrollment';
import { getStudentByClerkId } from '@/sanity/lib/student/getStudentByClerkId';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return new NextResponse('No signature found', { status: 400 });
    }

    if (!webhookSecret) {
      return new NextResponse('Webhook secret not configured', { status: 500 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return new NextResponse(`Webhook Error: ${errorMessage}`, {
        status: 400,
      });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const courseId = session.metadata?.courseId;
        const userId = session.metadata?.userId;

        // Try to extract courseId and userId from different sources
        const finalCourseId = courseId;
        const finalUserId = userId;

        // Fallback: try to get from session description or other fields
        if (!finalCourseId || !finalUserId) {
          return new NextResponse(null, { status: 200 });
        }

        const student = await getStudentByClerkId(finalUserId);
        if (!student) {
          return new NextResponse('Student not found', { status: 400 });
        }

        await createEnrollment({
          studentId: student._id,
          courseId: finalCourseId,
          paymentId: session.id,
          amount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents to dollars
        });

        return new NextResponse(null, { status: 200 });
      }

      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed':
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        // Handle other payment-related events (optional)
        return new NextResponse(null, { status: 200 });

      default:
        // Log unhandled events but return 200 to acknowledge receipt
        return new NextResponse(null, { status: 200 });
    }
  } catch {
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}
