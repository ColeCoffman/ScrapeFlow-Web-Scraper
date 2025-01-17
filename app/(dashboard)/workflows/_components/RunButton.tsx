"use client";

import { runWorkflow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const RunButton = ({ workflowId }: { workflowId: string }) => {
  const mutation = useMutation({
    mutationFn: runWorkflow,
    onSuccess: () => {
      toast.success("Workflow started", { id: workflowId });
    },
    onError: () => {
      toast.error("Failed to run workflow", { id: workflowId });
    },
  });
  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        toast.loading("Running workflow...", { id: workflowId });
        mutation.mutate({ workflowId });
      }}
      disabled={mutation.isPending}
    >
      <PlayIcon size={16} />
      <span>Run</span>
    </Button>
  );
};

export default RunButton;
