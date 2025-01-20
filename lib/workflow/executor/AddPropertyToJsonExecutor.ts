import { ExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../task/ClickElement";
import { ReadPropertyFromJSONTask } from "../task/ReadPropertyFromJSON";
import { AddPropertyToJSONTask } from "../task/AddPropertyToJSON";

export const AddPropertyToJsonExecutor = async (
  environment: ExecutionEnvironment<typeof AddPropertyToJSONTask>
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

    const propertyValue = environment.getInput("Property Value");
    if (!propertyValue) {
      environment.log.error("Input->Property Value is not defined");
    }

    const jsonObject = JSON.parse(json);
    jsonObject[property] = propertyValue;
    const updatedJson = JSON.stringify(jsonObject);

    environment.setOutput("Updated JSON", updatedJson);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
