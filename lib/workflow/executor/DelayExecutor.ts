import { ExecutionEnvironment } from "@/types/executor";
import { DelayTask } from "../task/Delay";

export const DelayExecutor = async (
  environment: ExecutionEnvironment<typeof DelayTask>
): Promise<boolean> => {
  try {
    const delay = environment.getInput("Delay (ms)");
    if (!delay) {
      environment.log.error("Input->Delay is not defined");
    }
    if (isNaN(parseInt(delay))) {
      environment.log.error("Input->Delay is not a number");
    }
    environment.log.info(`Delaying for ${delay}ms`);

    await new Promise((resolve) => setTimeout(resolve, parseInt(delay)));
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
