import { ExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../task/ClickElement";

export const ClickElementExecutor = async (
  environment: ExecutionEnvironment<typeof ClickElementTask>
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Input->Selector is not defined");
    }

    await environment.getPage()!.click(selector, {
      button: "left",
    });
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
