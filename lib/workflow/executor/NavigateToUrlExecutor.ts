import { ExecutionEnvironment } from "@/types/executor";
import { NavigateToUrlTask } from "../task/NavigateToUrl";

export const NavigateToUrlExecutor = async (
  environment: ExecutionEnvironment<typeof NavigateToUrlTask>
): Promise<boolean> => {
  try {
    const url = environment.getInput("URL");
    if (!url) {
      environment.log.error("Input->URL is not defined");
    }

    await environment.getPage()!.goto(url);
    environment.log.info(`Navigated to ${url}`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
