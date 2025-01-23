"use server";

import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";
import { auth } from "@clerk/nextjs/server";

export const downloadInvoice = async (invoiceId: string) => {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const invoice = await prisma.userPurchase.findUnique({
    where: {
      id: invoiceId,
      userId,
    },
  });

  if (!invoice) {
    return { error: "Bad Request" };
  }

  const stripeSession = await stripe.checkout.sessions.retrieve(
    invoice.stripeId
  );

  if (!stripeSession) {
    return { error: "Invoice not found" };
  }

  const stripeInvoice = await stripe.invoices.retrieve(
    stripeSession.invoice as string
  );

  if (!stripeInvoice) {
    return { error: "Invoice not found" };
  }

  return stripeInvoice.invoice_pdf;
};
