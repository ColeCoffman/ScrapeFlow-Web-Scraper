import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";
import * as cheerio from "cheerio";

export const ExtractTextFromElementExecutor = async (
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Selector not defined");
      return false;
    }
    const html = environment.getInput("Html");
    if (!html) {
      environment.log.error("Html not defined");
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      environment.log.error(`Element with selector ${selector} not found`);
      return false;
    }

    const extractedText = element.text();
    if (!extractedText) {
      environment.log.error(
        `No text found for element with selector ${selector}`
      );
      return false;
    }

    environment.setOutput("Extracted Text", extractedText);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
