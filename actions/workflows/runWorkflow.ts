"use server";

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { WorkflowExecutionPlan } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function runWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { workflowId, flowDefinition } = form;
  if (!workflowId) {
    throw new Error("Workflow ID is required");
  }

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId, userId },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  let executionPlan: WorkflowExecutionPlan;
  if (!flowDefinition) {
    throw new Error("Flow definition is not defined");
  }

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error) {
    throw new Error("flow definition is invalid");
  }

  if (!result.executionPlan) {
    throw new Error("No execution plan generated");
  }

  executionPlan = result.executionPlan;
  console.log(executionPlan);
}
