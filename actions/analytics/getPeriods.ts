"use server";

import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server";

export const getPeriods = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const years = await prisma.workflowExecution.aggregate({
    _min: {
      startedAt: true,
    },
  });

  const currentYear = new Date().getFullYear();
  const minYear = years._min.startedAt
    ? years._min.startedAt.getFullYear()
    : currentYear;

  const periods: Period[] = [];
  for (let year = minYear; year <= currentYear; year++) {
    for (let month = 0; month < 12; month++) {
      if (year === currentYear && month > new Date().getMonth()) {
        break;
      }
      periods.push({
        year,
        month,
      });
    }
  }

  return periods;
};
