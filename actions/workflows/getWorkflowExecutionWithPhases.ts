"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getWorkflowExecutionWithPhases = async (executionId: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be logged in to view this page");
  }
  return prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
      userId,
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });
};
