import { getWorkflowsForUser } from "@/actions/workflows/getWorkflowsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, InboxIcon } from "lucide-react";
import React, { Suspense } from "react";
import CreateWorkflowDialog from "./_components/CreateWorkflowDialog";
import WorkflowCard from "./_components/WorkflowCard";

const page = () => {
  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage your workflows
          </p>
        </div>
        <CreateWorkflowDialog triggerText="Create Workflow" />
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
};

const UserWorkflowsSkeleton = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-32 w-full" />
      ))}
    </div>
  );
};

async function UserWorkflows() {
  try {
    const workflows = await getWorkflowsForUser();
    if (workflows.length === 0) {
      return (
        <div className="flex flex-col gap-4 h-full items-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">No workflows found</p>
            <p className="text-sm text-muted-foreground">
              Create your first workflow by clicking the button below.
            </p>
          </div>
          <CreateWorkflowDialog triggerText="Create Workflow" />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {workflows.map((workflow) => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </div>
    );
  } catch (error) {
    return (
      <Alert variant={"destructive"}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong while fetching your workflows. Please try again
          later.
        </AlertDescription>
      </Alert>
    );
  }
}

export default page;
