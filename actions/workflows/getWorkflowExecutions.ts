"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const GetWorkflowExecutions = async (workflowId: string) => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return await prisma.workflowExecution.findMany({
    where: {
      workflowId,
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
