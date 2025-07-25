"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const removeWorkflowSchedule = async (workflowId: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  await prisma.workflow.update({
    where: { id: workflowId, userId },
    data: { cron: null, nextRunAt: null },
  });
  revalidatePath("/workflows");
};
