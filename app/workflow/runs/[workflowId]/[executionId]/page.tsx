"use client";

import { getWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import TopBar from "@/app/workflow/_components/topbar/TopBar";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import ExecutionViewer from "./_components/ExecutionViewer";

const ExecutionViewerPage = ({
  params,
}: {
  params: { workflowId: string; executionId: string };
}) => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <TopBar
        workflowId={params.workflowId}
        title="Workflow Execution Details"
        subTitle={`Execution ID: ${params.executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2 className="h-10 w-10 stroke-primary animate-spin" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={params.executionId} />
        </Suspense>
      </section>
    </div>
  );
};

export default ExecutionViewerPage;

async function ExecutionViewerWrapper({
  executionId,
}: {
  executionId: string;
}) {
  const workflowExecution = await getWorkflowExecutionWithPhases(executionId);

  if (!workflowExecution) {
    return <div>Workflow execution not found</div>;
  }

  return <ExecutionViewer initialData={workflowExecution} />;
}
