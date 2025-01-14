import { Loader2 } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Loader2 size={32} className="animate-spin stroke-primary" />
    </div>
  );
};

export default loading;
