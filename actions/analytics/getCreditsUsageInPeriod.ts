"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { PeriodToDateRange } from "@/lib/helper/dates";
import { eachDayOfInterval, format } from "date-fns";
import { ExecutionPhaseStatus } from "@/types/workflow";
import { ExecutionPhase } from "@prisma/client";

type Stats = Record<string, { total: number; success: number; failed: number }>;

export const getCreditsUsageInPeriod = async (period: Period) => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const dateRange = PeriodToDateRange(period);
  const executionPhases = await prisma.executionPhase.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lt: dateRange.endDate,
      },
      status: {
        in: [ExecutionPhaseStatus.COMPLETED, ExecutionPhaseStatus.FAILED],
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

  executionPhases.forEach((phase: ExecutionPhase) => {
    const date = format(phase.startedAt!, dateFormat);
    stats[date].total++;
    if (phase.status === ExecutionPhaseStatus.COMPLETED) {
      stats[date].success += phase.creditsConsumed ?? 0;
    } else if (phase.status === ExecutionPhaseStatus.FAILED) {
      stats[date].failed += phase.creditsConsumed ?? 0;
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
