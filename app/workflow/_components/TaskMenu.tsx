"use client";

import { TaskRegistry } from "@/lib/workflow/task/registry";
import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { TaskType } from "@/types/task";
import { Button } from "@/components/ui/button";

const TaskMenu = () => {
  return (
    <aside className="w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["extraction"]}
      >
        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold">
            Data Extraction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.PAGE_TO_HTML} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
};

const TaskMenuButton = ({ taskType }: { taskType: TaskType }) => {
  const task = TaskRegistry[taskType];
  const onDragStart = (
    e: React.DragEvent<HTMLButtonElement>,
    taskType: TaskType
  ) => {
    e.dataTransfer.setData("application/reactflow", taskType);
    e.dataTransfer.effectAllowed = "move";
  };
  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        className="flex justify-between items-center gap-2 border w-full"
        draggable
        onDragStart={(e) => {
          onDragStart(e, taskType);
        }}
      >
        <task.icon size={20} />
        {task.label}
      </Button>
    </div>
  );
};

export default TaskMenu;
