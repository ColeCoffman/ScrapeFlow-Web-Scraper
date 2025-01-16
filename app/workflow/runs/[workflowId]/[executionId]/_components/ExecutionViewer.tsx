"use client";

import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { GetWorkflowPhaseDetails } from "@/actions/workflows/getWorkflowPhaseDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DatesToDuration } from "@/lib/helper/dates";
import { GetPhasesTotalCost } from "@/lib/helper/phases";
import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  LucideIcon,
  WorkflowIcon,
} from "lucide-react";
import React, { useState } from "react";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

const ExecutionViewer = ({ initialData }: { initialData: ExecutionData }) => {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData,
    queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: (query) =>
      query.state.data?.status === WorkflowExecutionStatus.RUNNING
        ? 1000
        : false,
  });

  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase],
    enabled: !!selectedPhase,
    queryFn: () => GetWorkflowPhaseDetails(selectedPhase!),
  });

  const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;

  const duration = DatesToDuration(
    query.data?.completedAt,
    query.data?.startedAt
  );

  const creditsUsed = GetPhasesTotalCost(query.data?.phases || []);

  return (
    <div className="flex w-full h-full">
      <aside className="w-[440px] min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden">
        <div className="py-4 px-2">
          <ExecutionLabel
            label="Status"
            value={query.data?.status}
            icon={CircleDashedIcon}
          />
          <ExecutionLabel
            label="Started"
            value={
              <span className="lowercase">
                {query.data?.startedAt
                  ? formatDistanceToNow(new Date(query.data?.startedAt), {
                      addSuffix: true,
                    })
                  : "-"}
              </span>
            }
            icon={CalendarIcon}
          />
          <ExecutionLabel
            label="Duration"
            value={
              duration ? (
                duration
              ) : (
                <Loader2Icon size={20} className="animate-spin" />
              )
            }
            icon={ClockIcon}
          />
          <ExecutionLabel
            label="Credits Used"
            value={creditsUsed}
            icon={CoinsIcon}
          />
        </div>
        <Separator />
        <div className="flex justify-center items-center py-2 px-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
            <span className="font-semibold">Phases</span>
          </div>
        </div>
        <Separator />
        <div className="overflow-auto h-full px-2 py-4">
          {query.data?.phases.map((phase, index) => (
            <Button
              key={phase.id}
              variant="ghost"
              className={cn(
                "w-full justify-between",
                selectedPhase === phase.id && "bg-muted"
              )}
              onClick={() => {
                if (isRunning) return;
                setSelectedPhase(phase.id);
              }}
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline">{index + 1}</Badge>
                <p className="font-semibold">{phase.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">{phase.status}</p>
            </Button>
          ))}
        </div>
      </aside>
      <div className="flex w-full h-full">
        <pre>{JSON.stringify(phaseDetails.data, null, 4)}</pre>
      </div>
    </div>
  );
};

export default ExecutionViewer;

const ExecutionLabel = ({
  label,
  value,
  icon,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  icon: LucideIcon;
}) => {
  const Icon = icon;
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="flex text-muted-foreground items-center gap-2">
        <Icon size={20} className="stroke-muted-foreground/80" />
        <span>{label}</span>
      </div>
      <div className="font-semibold capitalize flex gap-2 items-center">
        <span>{value}</span>
      </div>
    </div>
  );
};
