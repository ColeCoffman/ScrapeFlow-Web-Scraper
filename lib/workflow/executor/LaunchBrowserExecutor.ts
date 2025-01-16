import puppeteer from "puppeteer";
import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export const LaunchBrowserExecutor = async (
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> => {
  try {
    const websiteUrl = environment.getInput("Website Url");
    const browser = await puppeteer.launch({
      headless: false, // TESTING
    });
    environment.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(websiteUrl);
    environment.setPage(page);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};
