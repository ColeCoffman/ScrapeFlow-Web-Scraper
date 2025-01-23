import { handleCheckoutSessionCompleted } from "@/lib/stripe/handleCheckoutSessionCompleted";
import { stripe } from "@/lib/stripe/stripe";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      default:
        break;
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Webhook error", { status: 400 });
  }
};
