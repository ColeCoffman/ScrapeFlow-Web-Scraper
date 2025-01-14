"use server";

import prisma from "@/lib/prisma";
import { workflowSchema, createWorkflowSchemaType } from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Edge } from "@xyflow/react";
import { AppNode } from "@/types/appNode";
import { createFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";

export async function createWorkflow(form: createWorkflowSchemaType) {
  const { success, data } = workflowSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const initialFlow: {
    nodes: AppNode[];
    edges: Edge[];
  } = {
    nodes: [],
    edges: [],
  };

  initialFlow.nodes.push(createFlowNode(TaskType.LAUNCH_BROWSER));

  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      ...data,
    },
  });

  if (!result) {
    throw new Error("Failed to create workflow");
  }

  redirect(`/workflow/editor/${result.id}`);
}
