"use server";

import { getAppUrl } from "@/lib/helper/appUrl";
import { stripe } from "@/lib/stripe/stripe";
import { getCreditsPack } from "@/types/billing";

import { PackId } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const purchaseCredits = async (packId: PackId) => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const pack = getCreditsPack(packId);
  if (!pack) {
    throw new Error("Invalid pack");
  }

  const priceId = pack.stripePriceId;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    invoice_creation: {
      enabled: true,
    },
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: getAppUrl("/billing"),
    cancel_url: getAppUrl("/billing"),
    metadata: {
      userId,
      packId,
    },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  redirect(session.url);
};
