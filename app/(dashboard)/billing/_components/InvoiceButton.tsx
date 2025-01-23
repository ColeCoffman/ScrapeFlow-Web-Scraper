"use client";

import { downloadInvoice } from "@/actions/billing/downloadInvoice";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { FileIcon, Loader2Icon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
const InvoiceButton = ({ invoiceId }: { invoiceId: string }) => {
  const mutation = useMutation({
    mutationFn: downloadInvoice,
    onSuccess: (data) => {
      if (data) {
        window.open(data as string, "_blank");
      }
    },
    onError: (error) => {
      toast.error("Failed to download invoice");
    },
  });
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-xs gap-2 text-muted-foreground px-1"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate(invoiceId)}
    >
      {mutation.isPending ? (
        <>
          <Loader2Icon className="w-4 h-4 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <FileIcon className="w-4 h-4" />
          View Invoice
        </>
      )}
    </Button>
  );
};

export default InvoiceButton;
