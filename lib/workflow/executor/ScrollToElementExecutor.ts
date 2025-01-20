import { ExecutionEnvironment } from "@/types/executor";
import { ScrollToElementTask } from "../task/ScrollToElement";

export const ScrollToElementExecutor = async (
  environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Input->Selector is not defined");
    }

    await environment.getPage()!.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Element with selector ${selector} not found`);
      }
      element.scrollIntoView({ behavior: "instant", block: "center" });
      return true;
    }, selector);

    environment.log.info(
      `Successfully scrolled to element with selector (${selector})`
    );
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
