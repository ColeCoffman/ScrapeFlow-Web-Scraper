import { ExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../task/ClickElement";
import { ReadPropertyFromJSONTask } from "../task/ReadPropertyFromJSON";

export const ReadPropertyFromJsonExecutor = async (
  environment: ExecutionEnvironment<typeof ReadPropertyFromJSONTask>
): Promise<boolean> => {
  try {
    const json = environment.getInput("JSON");
    if (!json) {
      environment.log.error("Input->JSON is not defined");
    }

    const property = environment.getInput("Property Name");
    if (!property) {
      environment.log.error("Input->Property is not defined");
    }

    const jsonObject = JSON.parse(json);
    const propertyValue = jsonObject[property];
    if (!propertyValue) {
      environment.log.error("Property not found in JSON");
      return false;
    }

    environment.setOutput("Property Value", propertyValue);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
