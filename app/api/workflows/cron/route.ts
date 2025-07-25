import { getAppUrl } from "@/lib/helper/appUrl";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const now = new Date();
  const workflows = await prisma.workflow.findMany({
    select: {
      id: true,
    },
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: {
        not: null,
      },
      nextRunAt: {
        lte: now,
      },
    },
  });

  for (const workflow of workflows) {
    triggerWorkflow(workflow.id);
  }

  return NextResponse.json(
    { workflows: workflows.map((w) => w.id) },
    { status: 200 }
  );
}

const triggerWorkflow = async (workflowId: string) => {
  const triggerApiUrl = getAppUrl(
    `/api/workflows/execute?workflowId=${workflowId}`
  );

  await fetch(triggerApiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET!}`,
    },
  }).catch((error) => {
    console.error(
      `Error triggering workflow with id ${workflowId} : ${error.message}`
    );
  });
};
