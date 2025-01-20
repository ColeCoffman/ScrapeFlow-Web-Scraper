import { TaskParamType } from "@/types/task";

export const ColorForHandle: Record<TaskParamType, string> = {
  STRING: "!bg-amber-400",
  BROWSER_INSTANCE: "!bg-sky-400",
  SELECT: "!bg-green-400",
  NUMBER: "!bg-red-400",
  BOOLEAN: "!bg-purple-400",
  CREDENTIAL: "!bg-teal-400",
};
