"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const GetWorkflowPhaseDetails = async (phaseId: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  return prisma.executionPhase.findFirst({
    where: {
      id: phaseId,
      workflowExecution: {
        userId,
      },
    },
    include: {
      logs: {
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  });
};
