import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";
import stripe, { Stripe } from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return new NextResponse("No signature found", { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret || ""
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`Webhook signature verification failed: ${errorMessage}`);
      return new NextResponse(`Webhook Error: ${errorMessage}`, {
        status: 400,
      });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const courseId = session.metadata?.courseId;
        const userId = session.metadata?.userId;

        if (!courseId || !userId) {
          return new NextResponse("Missing metadata", { status: 400 });
        }

        const student = await getStudentByClerkId(
          session.metadata?.userId || ""
        );
        if (!student) {
          console.error(
            "Student not found for userId:",
            session.metadata?.userId
          );
          return new NextResponse("Student not found", { status: 400 });
        }

        await createEnrollment({
          studentId: student._id,
          courseId: session.metadata?.courseId || "",
          paymentId: session.id,
          amount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents to dollars
        });
        return new NextResponse(null, { status: 200 });
      }
    }
    return new NextResponse(null, { status: 400 });
  } catch (error) {
    console.error("Error in webhook handler:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
