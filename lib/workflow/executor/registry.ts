import { TaskType } from "@/types/task";
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElement";
import { FillInputExecutor } from "./FillInputExecutor";
import { ClickElementExecutor } from "./ClickElementExecutor";
import { WaitForElementExecutor } from "./WaitForElementExecutor";
import { DelayExecutor } from "./DelayExecutor";
import { DeliverViaWebhookExecutor } from "./DeliverViaWebhookExecutor";
import { ExtractDataWithAIExecutor } from "./ExtractDataWithAIExecutor";
import { AddPropertyToJsonExecutor } from "./AddPropertyToJsonExecutor";
import { ReadPropertyFromJsonExecutor } from "./ReadPropertyFromJsonExecutor";
import { NavigateToUrlExecutor } from "./NavigateToUrlExecutor";
import { ScrollToElementExecutor } from "./ScrollToElementExecutor";

type ExecutorFunction<T extends WorkflowTask> = (
  environment: ExecutionEnvironment<T>
) => Promise<boolean>;

type RegistryType = {
  [K in TaskType]: ExecutorFunction<WorkflowTask & { type: K }>;
};

export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  DELAY: DelayExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookExecutor,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAIExecutor,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonExecutor,
  NAVIGATE_TO_URL: NavigateToUrlExecutor,
  SCROLL_TO_ELEMENT: ScrollToElementExecutor,
};
