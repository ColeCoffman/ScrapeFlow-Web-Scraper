import React, { Suspense } from "react";
import TopBar from "../../_components/topbar/TopBar";
import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { InboxIcon, Loader2Icon } from "lucide-react";
import ExecutionsTable from "./_components/ExecutionsTable";

const ExecutionsPage = ({ params }: { params: { workflowId: string } }) => {
  return (
    <div className="h-full w-full overflow-y-auto">
      <TopBar
        workflowId={params.workflowId}
        hideButtons
        title="Executions"
        subTitle="View all executions for this workflow"
      />
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-full w-full">
            <Loader2Icon className="animate-spin stroke-primary" size={30} />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  );
};

const ExecutionsTableWrapper = async ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executions = await GetWorkflowExecutions(workflowId);
  if (!executions) {
    return <div>No executions found</div>;
  }
  if (executions.length === 0) {
    return (
      <div className="container w-full py-6">
        <div className="flex flex-col items-center justify-center h-full gap-2 w-full">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-lg font-bold">No executions found</p>
            <p className="text-sm text-muted-foreground">
              Start scraping by clicking the execute button
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container w-full py-6">
      <ExecutionsTable workflowId={workflowId} initialData={executions} />
    </div>
  );
};

export default ExecutionsPage;
