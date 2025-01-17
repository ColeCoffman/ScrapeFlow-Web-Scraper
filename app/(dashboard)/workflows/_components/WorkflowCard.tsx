"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus, WorkflowStatus } from "@/types/workflow";
import { Workflow } from "@prisma/client";
import {
  ChevronRightIcon,
  ClockIcon,
  CoinsIcon,
  CornerDownRightIcon,
  MoreVerticalIcon,
  MoveRightIcon,
  PlayIcon,
  ShuffleIcon,
  TrashIcon,
} from "lucide-react";
import { FileTextIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import TooltipWrapper from "@/components/TooltipWrapper";
import DeleteWorkflowDialog from "./DeleteWorkflowDialog";
import RunButton from "./RunButton";
import SchedulerDialog from "./SchedulerDialog";
import ExecutionStatusIndicator from "@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator";
import { formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

const WorkflowCard = ({ workflow }: { workflow: Workflow }) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  const statusColors = {
    [WorkflowStatus.DRAFT]: "bg-yellow-400 text-yellow-600",
    [WorkflowStatus.PUBLISHED]: "bg-primary",
  };
  return (
    <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30">
      <CardContent className="p-4 flex items-center justify-between h-[100px]">
        <div className="flex items-center justify-end space-x-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              statusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon className="w-5 h-5" />
            ) : (
              <PlayIcon className="w-5 h-5" />
            )}
          </div>
          <div className="">
            <h3 className="text-base font-bold text-muted-foreground flex items-center">
              <Link
                href={`/workflow/editor/${workflow.id}`}
                className="flex items-center hover:underline"
              >
                {workflow.name}
              </Link>
              {isDraft && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Draft
                </span>
              )}
            </h3>
            <ScheduleSection
              isDraft={isDraft}
              creditsCost={workflow.creditsCost}
              workflowId={workflow.id}
              cron={workflow.cron}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && <RunButton workflowId={workflow.id} />}
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "flex items-center gap-2"
            )}
          >
            <ShuffleIcon size={16} />
            <span>Edit</span>
          </Link>
          <WorkflowActions
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
        </div>
      </CardContent>
      <LastRunDetails workflow={workflow} />
    </Card>
  );
};

const WorkflowActions = ({
  workflowName,
  workflowId,
}: {
  workflowName: string;
  workflowId: string;
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <TooltipWrapper content={"More actions"}>
              <div className="flex items-center justify-center w-full h-full">
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center text-destructive gap-2"
            onSelect={() => setShowDeleteDialog((prev) => !prev)}
          >
            <TrashIcon size={16} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default WorkflowCard;

const ScheduleSection = ({
  isDraft,
  creditsCost,
  workflowId,
  cron,
}: {
  isDraft: boolean;
  creditsCost: number;
  workflowId: string;
  cron: string | null;
}) => {
  if (isDraft) return null;
  return (
    <div className="flex items-center gap-2">
      <CornerDownRightIcon className="w-4 h-4 text-muted-foreground" />
      <SchedulerDialog
        workflowId={workflowId}
        cron={cron}
        key={`${workflowId}-${cron}`}
      />
      <MoveRightIcon className="w-4 h-4 text-muted-foreground" />
      <TooltipWrapper content="Cost per execution">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="space-x-2 text-muted-foreground rounded-sm"
          >
            <CoinsIcon className="w-4 h-4" />
            <span className="text-sm">{creditsCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  );
};

const LastRunDetails = ({ workflow }: { workflow: Workflow }) => {
  const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow;
  const formattedStartedAt =
    lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });
  const nextScheduledRun =
    nextRunAt && formatDistanceToNow(nextRunAt, { addSuffix: true });
  const nextScheduledRunUTC =
    nextRunAt && formatInTimeZone(nextRunAt, "UTC", "MMM d, yyyy h:mm a");
  const isDraft = workflow.status === WorkflowStatus.DRAFT;

  if (workflow.id === "cm5ztitkq0014lvhfrogc8oml") {
    console.log(nextRunAt?.toLocaleString());
  }

  if (isDraft) return null;
  return (
    <div
      className={cn(
        "px-4 py-1 flex justify-between items-center text-muted-foreground",
        lastRunStatus === WorkflowExecutionStatus.COMPLETED
          ? "bg-green-500/5"
          : lastRunStatus === WorkflowExecutionStatus.FAILED
          ? "bg-red-500/5"
          : lastRunStatus === WorkflowExecutionStatus.RUNNING
          ? "bg-yellow-500/5"
          : "bg-primary/5"
      )}
    >
      <div className="flex items-center gap-2 text-sm">
        {lastRunAt && (
          <Link
            href={`/workflow/runs/${workflow.id}/${lastRunId}`}
            className="flex items-center gap-2 group"
          >
            <span>Last run:</span>
            <ExecutionStatusIndicator
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <span>{lastRunStatus}</span>
            <span>{formattedStartedAt}</span>
            <ChevronRightIcon
              size={14}
              className="-translate-x-[2px] group-hover:translate-x-0 transition"
            />
          </Link>
        )}
        {!lastRunAt && <span>No executions yet</span>}
      </div>
      {nextRunAt && (
        <div className="flex items-center gap-2 text-sm">
          <ClockIcon size={12} />
          <span>Next run:</span>
          <span>{nextScheduledRun}</span>
          <span className="text-xs">({nextScheduledRunUTC} UTC)</span>
        </div>
      )}
    </div>
  );
};
