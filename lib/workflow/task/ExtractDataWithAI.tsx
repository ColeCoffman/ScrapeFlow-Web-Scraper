import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { BrainIcon } from "lucide-react";

export const ExtractDataWithAITask = {
  type: TaskType.EXTRACT_DATA_WITH_AI,
  label: "Extract data with AI",
  credits: 4,
  icon: (props) => <BrainIcon className="stroke-rose-400" {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Content",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
    {
      name: "Prompt",
      type: TaskParamType.STRING,
      variant: "textarea",
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Extracted Data",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask;
