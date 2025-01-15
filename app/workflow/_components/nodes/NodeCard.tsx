"use client";

import useFlowValidation from "@/components/hooks/useFlowValidation";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import React from "react";

const NodeCard = ({
  children,
  nodeId,
  isSelected,
}: {
  children: React.ReactNode;
  nodeId: string;
  isSelected: boolean;
}) => {
  const { getNode, setCenter } = useReactFlow();
  const { invalidInputs } = useFlowValidation();
  const isInvalid = invalidInputs.some((input) => input.nodeId === nodeId);

  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;
        const { position, measured } = node;
        if (!measured || !position) return;
        const { width, height } = measured;
        const { x, y } = position;
        if (
          x === undefined ||
          y === undefined ||
          width === undefined ||
          height === undefined
        )
          return;
        setCenter(x + width / 2, y + height / 2, { duration: 500, zoom: 1 });
      }}
      className={cn(
        "rounded-md cursor-pointer bg-background border-2 border-separate w-[420px] text-xs gap-1 flex flex-col",
        isSelected && "border-primary",
        isInvalid && "border-destructive border-2"
      )}
    >
      {children}
    </div>
  );
};

export default NodeCard;
