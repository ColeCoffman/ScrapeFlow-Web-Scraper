import React from "react";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import updateWorkflow from "@/actions/workflows/updateWorkflow";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const SaveButton = ({ workflowId }: { workflowId: string }) => {
  const { toObject } = useReactFlow();
  const saveMutation = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: () => {
      toast.success("Workflow saved successfully", { id: "save-workflow" });
    },
    onError: () => {
      toast.error("Failed to save workflow", { id: "save-workflow" });
    },
  });

  return (
    <Button
      disabled={saveMutation.isPending}
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());
        toast.loading("Saving workflow...", { id: "save-workflow" });
        saveMutation.mutate({ id: workflowId, definition: workflowDefinition });
      }}
    >
      <SaveIcon size={16} />
      Save
    </Button>
  );
};

export default SaveButton;
