import { getPeriods } from "@/actions/analytics/getPeriods";
import React, { Suspense } from "react";
import PeriodSelector from "./_components/PeriodSelector";
import { Period } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatsCardsValues } from "@/actions/analytics/getStatsCardsValues";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import StatsCard from "./_components/StatsCard";
import { getWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import ExecutionStatusChart from "./_components/ExecutionStatusChart";
import { getCreditsUsageInPeriod } from "@/actions/analytics/getCreditsUsageInPeriod";
import CreditsUsageChart from "../billing/_components/CreditsUsageChart";

const HomePage = ({
  searchParams,
}: {
  searchParams: { month?: string; year?: string };
}) => {
  const period: Period = {
    month: searchParams.month
      ? parseInt(searchParams.month)
      : new Date().getMonth(),
    year: searchParams.year
      ? parseInt(searchParams.year)
      : new Date().getFullYear(),
  };
  return (
    <div className="flex flex-col flex-1 h-full gap-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="h-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsCardsSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <CreditsUsuageInPeriod selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  );
};

const PeriodSelectorWrapper = async ({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) => {
  const periods = await getPeriods();
  return <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} />;
};

const StatsCards = async ({ selectedPeriod }: { selectedPeriod: Period }) => {
  const data = await getStatsCardsValues(selectedPeriod);
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Workflow Executions"
        value={data.workflowExecutions}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="Phases Executions"
        value={data.phasesExecutions}
        icon={WaypointsIcon}
      />
      <StatsCard
        title="Credits Consumed"
        value={data.creditsConsumed}
        icon={CoinsIcon}
      />
    </div>
  );
};

const StatsCardsSkeleton = () => {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
      <Skeleton className="w-full min-h-[120px]" />
      <Skeleton className="w-full min-h-[120px]" />
      <Skeleton className="w-full min-h-[120px]" />
    </div>
  );
};

const StatsExecutionStatus = async ({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) => {
  const data = await getWorkflowExecutionStats(selectedPeriod);
  return <ExecutionStatusChart data={data} />;
};

const CreditsUsuageInPeriod = async ({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) => {
  const data = await getCreditsUsageInPeriod(selectedPeriod);
  return (
    <CreditsUsageChart
      data={data}
      title="Daily Credits Usage"
      description="Credits consumed by day"
    />
  );
};

export default HomePage;
