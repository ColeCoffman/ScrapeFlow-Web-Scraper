import { ExecutionEnvironment } from "@/types/executor";
import { DeliverViaWebhookTask } from "../task/DeliverViaWebhook";

export const DeliverViaWebhookExecutor = async (
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> => {
  try {
    const targetUrl = environment.getInput("Target URL");
    const requestBody = environment.getInput("Request Body");
    if (!targetUrl) {
      environment.log.error("Input->Target URL is not defined");
    }
    if (!requestBody) {
      environment.log.error("Input->Request Body is not defined");
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status !== 200) {
      environment.log.error(
        `Webhook delivery failed with status code ${response.status}`
      );
      return false;
    }

    environment.log.info(
      `Webhook delivery successful with status code ${response.status}`
    );

    const responseData = await response.json();
    environment.log.info(
      `Webhook delivery response: ${JSON.stringify(responseData)}`
    );

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
