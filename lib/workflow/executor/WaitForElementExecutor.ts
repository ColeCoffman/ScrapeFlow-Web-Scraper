import { ExecutionEnvironment } from "@/types/executor";
import { WaitForElementTask } from "../task/WaitForElement";

export const WaitForElementExecutor = async (
  environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Input->Selector is not defined");
    }

    const visibility = environment.getInput("Visibility");
    if (!visibility) {
      environment.log.error("Input->Visibility is not defined");
    }

    await environment.getPage()!.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
    });
    environment.log.info(
      `Element with selector (${selector}) became ${visibility}`
    );
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
