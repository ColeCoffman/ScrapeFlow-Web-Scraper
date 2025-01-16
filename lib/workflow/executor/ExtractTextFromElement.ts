import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";
import * as cheerio from "cheerio";

console.log("Cheerio module:", cheerio);

export const ExtractTextFromElementExecutor = async (
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      console.error("Selector not defined");
      return false;
    }
    const html = environment.getInput("Html");
    if (!html) {
      console.error("Html not defined");
      return false;
    }

    console.log("Loading HTML with Cheerio");
    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      console.error(`Element with selector ${selector} not found`);
      return false;
    }

    const extractedText = element.text();
    if (!extractedText) {
      console.error(`No text found for element with selector ${selector}`);
      return false;
    }

    environment.setOutput("Extracted Text", extractedText);

    return true;
  } catch (error) {
    console.error("Error in ExtractTextFromElementExecutor:", error);
    return false;
  }
};
