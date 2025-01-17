"use client";

import { publishWorkflow } from "@/actions/workflows/publishWorkflow";
import { runWorkflow } from "@/actions/workflows/runWorkflow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon, UploadIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const PublishButton = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const mutation = useMutation({
    mutationFn: publishWorkflow,
    onSuccess: () => {
      toast.success("Workflow published", { id: workflowId });
    },
    onError: () => {
      toast.error("Failed to publish workflow", { id: workflowId });
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
        toast.loading("Publishing workflow...", { id: workflowId });
        mutation.mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
      disabled={mutation.isPending}
    >
      <UploadIcon size={16} className="stroke-green-400" />
      <span>Publish</span>
    </Button>
  );
};

export default PublishButton;
