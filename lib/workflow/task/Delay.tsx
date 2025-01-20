import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { ClockIcon } from "lucide-react";

export const DelayTask = {
  type: TaskType.DELAY,
  label: "Delay",
  credits: 1,
  icon: (props) => <ClockIcon className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Delay (ms)",
      type: TaskParamType.NUMBER,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const,
} satisfies WorkflowTask;
