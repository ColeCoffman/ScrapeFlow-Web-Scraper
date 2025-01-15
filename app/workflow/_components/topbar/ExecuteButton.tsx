"use client";

import { runWorkflow } from "@/actions/workflows/runWorkflow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const ExecuteButton = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const mutation = useMutation({
    mutationFn: runWorkflow,
    onSuccess: () => {
      toast.success("Execution started", { id: "flow-execution" });
    },
    onError: () => {
      toast.error("Failed to execute workflow", { id: "flow-execution" });
    },
  });

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const executionPlan = generate.generateExecutionPlan();
        if (!executionPlan) {
          return;
        }
        mutation.mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
      disabled={mutation.isPending}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      <span>Execute</span>
    </Button>
  );
};

export default ExecuteButton;
