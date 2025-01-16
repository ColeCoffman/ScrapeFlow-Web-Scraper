import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/types/workflow";
import React from "react";

const statusColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: "bg-slate-400",
  RUNNING: "bg-yellow-400",
  COMPLETED: "bg-green-400",
  FAILED: "bg-red-400",
};

const ExecutionStatusIndicator = ({
  status,
}: {
  status: WorkflowExecutionStatus;
}) => {
  return <div className={cn("w-2 h-2 rounded-full", statusColors[status])} />;
};

export default ExecutionStatusIndicator;
