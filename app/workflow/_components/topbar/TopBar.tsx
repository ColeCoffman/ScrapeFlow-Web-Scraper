"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import SaveButton from "./SaveButton";
import ExecuteButton from "./ExecuteButton";
import NavigationTabs from "./NavigationTabs";
import PublishButton from "./PublishButton";
import UnpublishButton from "./UnpublishButton";
interface TopBarProps {
  title: string;
  subTitle?: string;
  workflowId: string;
  hideButtons?: boolean;
  isPublished?: boolean;
}

const TopBar = ({
  title,
  subTitle,
  workflowId,
  hideButtons,
  isPublished = false,
}: TopBarProps) => {
  const router = useRouter();

  return (
    <header className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="Back">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft size={20} />
          </Button>
        </TooltipWrapper>
        <div className="">
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subTitle && (
            <p className="text-xs text-muted-foreground truncate text-ellipsis">
              {subTitle}
            </p>
          )}
        </div>
      </div>
      <NavigationTabs workflowId={workflowId} />
      <div className="flex gap-1 flex-1 justify-end">
        {!hideButtons && (
          <>
            <ExecuteButton workflowId={workflowId} />
            {isPublished && <UnpublishButton workflowId={workflowId} />}
            {!isPublished && (
              <>
                <SaveButton workflowId={workflowId} />
                <PublishButton workflowId={workflowId} />
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default TopBar;
