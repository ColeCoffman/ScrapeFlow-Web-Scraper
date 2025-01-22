"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { PeriodToDateRange } from "@/lib/helper/dates";
import { eachDayOfInterval, format } from "date-fns";
import { WorkflowExecutionStatus } from "@/types/workflow";

type Stats = Record<string, { total: number; success: number; failed: number }>;

export const getWorkflowExecutionStats = async (period: Period) => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const dateRange = PeriodToDateRange(period);
  const workflowExecutions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lt: dateRange.endDate,
      },
    },
  });

  const dateFormat = "yyyy-MM-dd";

  const stats: Stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => {
      return format(date, dateFormat);
    })
    .reduce((acc, date) => {
      acc[date] = {
        total: 0,
        success: 0,
        failed: 0,
      };
      return acc;
    }, {} as Stats);

  workflowExecutions.forEach((execution) => {
    const date = format(execution.startedAt!, dateFormat);
    stats[date].total++;
    if (execution.status === WorkflowExecutionStatus.COMPLETED) {
      stats[date].success++;
    } else if (execution.status === WorkflowExecutionStatus.FAILED) {
      stats[date].failed++;
    }
  });

  const result = Object.entries(stats).map(([date, stats]) => {
    return {
      date,
      ...stats,
    };
  });
  return result;
};
