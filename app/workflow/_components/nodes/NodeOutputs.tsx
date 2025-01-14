"use client";

import { cn } from "@/lib/utils";
import { Position } from "@xyflow/react";
import { TaskParam } from "@/types/task";
import { Handle } from "@xyflow/react";
import { ReactNode } from "react";
import { ColorForHandle } from "./common";

export const NodeOutputs = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-1 divide-y">{children}</div>;
};

export const NodeOutput = ({ output }: { output: TaskParam }) => {
  return (
    <div className="flex justify-end relative p-3 bg-secondary">
      <span className="text-xs text-muted-foreground">{output.name}</span>
      <Handle
        id={output.name}
        type="source"
        position={Position.Right}
        className={cn(
          "!bg-muted-foreground !border-2 !border-background !-right-2 !w-4 !h-4",
          ColorForHandle[output.type]
        )}
      />
    </div>
  );
};
