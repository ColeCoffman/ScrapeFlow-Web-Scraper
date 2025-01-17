"use client";

import { publishWorkflow } from "@/actions/workflows/publishWorkflow";
import { runWorkflow } from "@/actions/workflows/runWorkflow";
import { unpublishWorkflow } from "@/actions/workflows/unpublishWorkflow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { DownloadIcon, PlayIcon, UploadIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const UnpublishButton = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const mutation = useMutation({
    mutationFn: unpublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow unpublished", { id: workflowId });
    },
    onError: () => {
      toast.error("Failed to unpublish workflow", { id: workflowId });
    },
  });

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        toast.loading("Unpublishing workflow...", { id: workflowId });
        mutation.mutate(workflowId);
      }}
      disabled={mutation.isPending}
    >
      <DownloadIcon size={16} className="stroke-orange-500" />
      <span>Unpublish</span>
    </Button>
  );
};

export default UnpublishButton;
