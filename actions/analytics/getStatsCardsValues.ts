"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export const getStatsCardsValues = async (selectedPeriod: Period) => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not found");
  }
  const dateRange = PeriodToDateRange(selectedPeriod);
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      createdAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [WorkflowExecutionStatus.COMPLETED, WorkflowExecutionStatus.FAILED],
      },
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null,
          },
        },
        select: {
          creditsConsumed: true,
        },
      },
    },
  });

  const stats = {
    workflowExecutions: executions.length,
    creditsConsumed: executions.reduce(
      (acc, curr) => acc + curr.creditsConsumed,
      0
    ),
    phasesExecutions: executions.reduce(
      (acc, curr) => acc + curr.phases.length,
      0
    ),
  };

  return stats;
};
