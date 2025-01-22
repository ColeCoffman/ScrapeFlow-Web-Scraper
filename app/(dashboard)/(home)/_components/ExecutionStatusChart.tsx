"use client";

import { getWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Layers2Icon } from "lucide-react";
import React from "react";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis } from "recharts";

type ChartData = Awaited<ReturnType<typeof getWorkflowExecutionStats>>;

const chartConfig: ChartConfig = {
  success: {
    color: "hsl(var(--chart-2))",
    label: "Success",
  },
  failed: {
    color: "hsl(var(--chart-1))",
    label: "Failed",
  },
};

const ExecutionStatusChart = ({ data }: { data: ChartData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-bold gap-2">
          <Layers2Icon className="w-6 h-6 text-primary" />
          Workflow Execution Status
        </CardTitle>
        <CardDescription>
          Daily number of successful and failed workflow executions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[200px] w-full" config={chartConfig}>
          <AreaChart data={data} height={200} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="bump"
              dataKey="success"
              stroke="var(--color-success)"
              fill="var(--color-success)"
              min={0}
              stackId="a"
            />
            <Area
              type="bump"
              dataKey="failed"
              stroke="var(--color-failed)"
              fill="var(--color-failed)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ExecutionStatusChart;
