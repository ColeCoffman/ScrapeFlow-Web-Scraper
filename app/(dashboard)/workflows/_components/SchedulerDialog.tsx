"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TriangleAlertIcon,
  CalendarIcon,
  ClockIcon,
  TrashIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { updateWorkflowCron } from "@/actions/workflows/updateWorkflowCron";
import { toast } from "sonner";
import cronstrue from "cronstrue";
import parser from "cron-parser";
import { removeWorkflowSchedule } from "@/actions/workflows/removeWorkflowSchedule";

const SchedulerDialog = (props: {
  workflowId: string;
  cron: string | null;
}) => {
  const [cron, setCron] = useState(props.cron || "");
  const mutation = useMutation({
    mutationFn: updateWorkflowCron,
    onSuccess: () => {
      toast.success("Workflow scheduled successfully", { id: "cron" });
    },
    onError: () => {
      toast.error("Failed to schedule workflow", { id: "cron" });
    },
  });
  const removeMutation = useMutation({
    mutationFn: removeWorkflowSchedule,
    onSuccess: () => {
      toast.success("Workflow schedule removed successfully", { id: "cron" });
    },
    onError: () => {
      toast.error("Failed to remove workflow schedule", { id: "cron" });
    },
  });
  const [validCron, setValidCron] = useState(false);
  const [humanCronString, setHumanCronString] = useState("");

  useEffect(() => {
    try {
      parser.parseExpression(cron);
      const humanCronString = cronstrue.toString(cron);
      setHumanCronString(humanCronString);
      setValidCron(true);
    } catch (error) {
      setValidCron(false);
    }
  }, [cron]);

  const workflowHasValidCron = props.cron && props.cron.trim() !== "";
  const readableSavedCron =
    workflowHasValidCron && cronstrue.toString(props.cron!);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className={cn(
            "text-sm p-0 h-auto text-orange-500",
            workflowHasValidCron && "text-primary"
          )}
        >
          {workflowHasValidCron && (
            <div className="flex items-center gap-2">
              <ClockIcon className="w-3 h-3" />
              <span>{readableSavedCron}</span>
            </div>
          )}
          {!workflowHasValidCron && (
            <div className="flex items-center gap-1">
              <TriangleAlertIcon className="w-3 h-3" />
              <span>Set Schedule</span>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader title="Set Schedule" icon={CalendarIcon} />
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Specify a cron expression to schedule your workflow.
            <br />
            All times are in UTC.
          </p>
          <Input
            placeholder="E.g. */5 * * * * (Every 5 minutes)"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />
          <div
            className={cn(
              "bg-accent rounded-md p-4 border text-sm border-destructive text-red-500",
              validCron && "border-primary text-primary"
            )}
          >
            {validCron ? humanCronString : "Invalid cron expression"}
          </div>
          {workflowHasValidCron && (
            <DialogTrigger asChild>
              <Button
                variant="link"
                size="sm"
                className="text-sm p-0 h-auto text-destructive"
                disabled={removeMutation.isPending}
                onClick={() => {
                  toast.loading("Removing schedule...", { id: "cron" });
                  removeMutation.mutate({ id: props.workflowId });
                }}
              >
                <TrashIcon className="w-3 h-3" />
                <span>Remove Schedule</span>
              </Button>
            </DialogTrigger>
          )}
        </div>
        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button variant="secondary" className="w-full">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="w-full"
              onClick={() => {
                toast.loading("Saving...", { id: "cron" });
                mutation.mutate({ id: props.workflowId, cron });
              }}
              disabled={mutation.isPending || !validCron}
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulerDialog;
