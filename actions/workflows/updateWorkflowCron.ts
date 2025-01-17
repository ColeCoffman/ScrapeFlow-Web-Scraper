"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import parser from "cron-parser";
import { revalidatePath } from "next/cache";

export const updateWorkflowCron = async ({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  if (!cron) {
    throw new Error("Cron is required");
  }
  try {
    const interval = parser.parseExpression(cron, { utc: true });
    await prisma.workflow.update({
      where: { id, userId },
      data: { cron, nextRunAt: interval.next().toDate() },
    });
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed to update workflow cron");
  }
  revalidatePath("/workflows");
};
