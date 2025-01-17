import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/types/workflow";
import React from "react";

const statusColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: "bg-slate-400",
  RUNNING: "bg-yellow-400",
  COMPLETED: "bg-green-400",
  FAILED: "bg-red-400",
};

const labelColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: "text-slate-400",
  RUNNING: "text-yellow-400",
  COMPLETED: "text-green-400",
  FAILED: "text-red-400",
};

export default function ExecutionStatusIndicator({
  status,
}: {
  status: WorkflowExecutionStatus;
}) {
  return <div className={cn("w-2 h-2 rounded-full", statusColors[status])} />;
}

export const ExecutionStatusLabel = ({
  status,
}: {
  status: WorkflowExecutionStatus;
}) => {
  return (
    <span className={cn("capitalize", labelColors[status])}>
      {status.toLowerCase()}
    </span>
  );
};
