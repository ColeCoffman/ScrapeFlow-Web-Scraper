import Logo from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { Loader2Icon } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full gap-4">
      <Logo iconSize={50} fontSize="text-3xl" />
      <Separator className="max-w-xs" />
      <div className="flex items-center gap-2 justify-center">
        <Loader2Icon className="stroke-primary animate-spin" />
        <p className="text-muted-foreground">Setting up your account...</p>
      </div>
    </div>
  );
};

export default loading;
