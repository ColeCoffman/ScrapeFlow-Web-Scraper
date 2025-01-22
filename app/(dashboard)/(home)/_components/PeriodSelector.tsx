"use client";

import { Period } from "@/types/analytics";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PeriodSelector = ({
  periods,
  selectedPeriod,
}: {
  periods: Period[];
  selectedPeriod: Period;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <Select
      onValueChange={(value) => {
        const [month, year] = value.split("-");
        const params = new URLSearchParams(searchParams);
        params.set("month", month);
        params.set("year", year);
        router.push(`/?${params.toString()}`);
      }}
      defaultValue={`${selectedPeriod.month}-${selectedPeriod.year}`}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a period" />
      </SelectTrigger>
      <SelectContent>
        {periods
          .slice()
          .reverse()
          .map((period, index) => (
            <SelectItem key={index} value={`${period.month}-${period.year}`}>
              {`${MONTHS[period.month]} ${period.year}`}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default PeriodSelector;
