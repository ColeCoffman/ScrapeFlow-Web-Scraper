import { getCreditsPack, PackId } from "@/types/billing";
import "server-only";
import Stripe from "stripe";
import prisma from "../prisma";

export const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session
) => {
  if (!session.metadata) throw new Error("Missing Metadata");

  const { userId, packId } = session.metadata;

  if (!userId) throw new Error("Missing User Id");
  if (!packId) throw new Error("Missing Pack Id");

  const purchasedPack = getCreditsPack(packId as PackId);

  if (!purchasedPack) throw new Error("Invalid Pack Id");

  await prisma.userBalance.upsert({
    where: { userId },
    update: { credits: { increment: purchasedPack.credits } },
    create: { userId, credits: purchasedPack.credits },
  });

  await prisma.userPurchase.create({
    data: {
      userId,
      stripeId: session.id,
      description: `${purchasedPack.name} - ${purchasedPack.credits} credits`,
      amount: session.amount_total!,
      currency: session.currency!,
    },
  });
};
