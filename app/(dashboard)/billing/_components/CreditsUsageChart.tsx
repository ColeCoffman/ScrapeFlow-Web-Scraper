"use client";

import { getCreditsUsageInPeriod } from "@/actions/analytics/getCreditsUsageInPeriod";
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
import { ChartColumnStackedIcon, Layers2Icon } from "lucide-react";
import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
} from "recharts";

type ChartData = Awaited<ReturnType<typeof getCreditsUsageInPeriod>>;

const chartConfig: ChartConfig = {
  success: {
    color: "hsl(var(--chart-2))",
    label: "Successful Phases Credits",
  },
  failed: {
    color: "hsl(var(--chart-1))",
    label: "Failed Phases Credits",
  },
};

const CreditsUsageChart = ({
  data,
  title,
  description,
}: {
  data: ChartData;
  title: string;
  description: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-bold gap-2">
          <ChartColumnStackedIcon className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[200px] w-full" config={chartConfig}>
          <BarChart data={data} height={200} margin={{ top: 20 }}>
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
            <Bar
              fillOpacity={0.8}
              radius={[0, 0, 4, 4]}
              dataKey="success"
              stroke="var(--color-success)"
              fill="var(--color-success)"
              stackId="a"
            />
            <Bar
              fillOpacity={0.8}
              radius={[4, 4, 0, 0]}
              dataKey="failed"
              stroke="var(--color-failed)"
              fill="var(--color-failed)"
              stackId="a"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CreditsUsageChart;
