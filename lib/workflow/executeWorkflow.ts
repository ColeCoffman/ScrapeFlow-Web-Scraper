import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { waitFor } from "../helper/waitFor";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "./executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";

export const ExecuteWorkflow = async (executionId: string) => {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: {
      phases: true,
      workflow: true,
    },
  });

  if (!execution) throw new Error("Execution not found");

  const edges = JSON.parse(execution.definition).edges as Edge[];

  const environment: Environment = {
    phases: {},
  };

  await initializeWorkflowExecution(executionId, execution.workflowId);
  await initializePhaseStatuses(execution);

  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    // TODO: consume credits
    const phaseExecution = await executeWorkflowPhase(
      phase,
      environment,
      edges
    );
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );
  await cleanupEnvironment(environment);

  revalidatePath(`/workflow/runs`);
};

const initializeWorkflowExecution = async (
  executionId: string,
  workflowId: string
) => {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: WorkflowExecutionStatus.RUNNING,
      startedAt: new Date(),
    },
  });

  await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      lastRunAt: new Date(),
      lastRunId: executionId,
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
    },
  });
};

const initializePhaseStatuses = async (execution: any) => {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id),
      },
    },
    data: { status: ExecutionPhaseStatus.PENDING },
  });
};

const finalizeWorkflowExecution = async (
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) => {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: { id: workflowId, lastRunId: executionId },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((error) => {});
};

const executeWorkflowPhase = async (
  phase: ExecutionPhase,
  environment: Environment,
  edges: Edge[]
) => {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;

  setupEnvironmentForPhase(node, environment, edges);

  // update phase status
  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;
  console.log(`Executing phase ${phase.id} with ${creditsRequired} credits`);

  // TODO: decrement credits balance

  const success = await executePhase(phase, node, environment);
  const outputs = environment.phases[node.id].outputs;

  await finalizePhaseExecution(phase.id, success, outputs);

  return { success };
};

const finalizePhaseExecution = async (
  phaseId: string,
  success: boolean,
  outputs: any
) => {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: { id: phaseId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
    },
  });
};

const executePhase = async (
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment
): Promise<boolean> => {
  const runFunction = ExecutorRegistry[node.data.type];
  if (!runFunction) return false;

  const executionEnvironment: ExecutionEnvironment<any> =
    createExecutionEnvironment(node, environment);

  return runFunction(executionEnvironment);
};

const setupEnvironmentForPhase = (
  node: AppNode,
  environment: Environment,
  edges: Edge[]
) => {
  environment.phases[node.id] = {
    inputs: {},
    outputs: {},
  };
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }

    // Get input value form outputs in the environment
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );

    if (!connectedEdge) {
      console.error("Missing Edge for input", input.name, "node id: ", node.id);
      continue;
    }

    const outputValue =
      environment.phases[connectedEdge.source].outputs[
        connectedEdge.sourceHandle!
      ];
    if (!outputValue) {
      console.error("Missing output value for edge", connectedEdge);
      continue;
    }

    environment.phases[node.id].inputs[input.name] = outputValue;
  }
};

const createExecutionEnvironment = (
  node: AppNode,
  environment: Environment
): ExecutionEnvironment<any> => {
  return {
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => {
      environment.browser = browser;
    },
    getPage: () => environment.page,
    setPage: (page: Page) => {
      environment.page = page;
    },
    setOutput: (name: string, value: string) => {
      environment.phases[node.id].outputs[name] = value;
    },
  };
};

const cleanupEnvironment = async (environment: Environment) => {
  if (environment.browser) {
    await environment.browser.close().catch((err) => {
      console.error("Error closing browser", err);
    });
  }
};
