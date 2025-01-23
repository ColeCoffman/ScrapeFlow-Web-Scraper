"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CoinsIcon, CreditCardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreditsPacks, PackId } from "@/types/billing";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { purchaseCredits } from "@/actions/billing/purchaseCredits";

const CreditsPurchase = () => {
  const [selectedPack, setSelectedPack] = useState<PackId | null>(null);
  const mutation = useMutation({
    mutationFn: purchaseCredits,
    onSuccess: () => {
      toast.success("Credits purchased successfully");
    },
    onError: (error) => {
      toast.error("Failed to purchase credits");
    },
  });

  const handlePackChange = (value: PackId) => {
    setSelectedPack(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CoinsIcon className="h-6 w-6 text-primary" />
          Purchase Credits
        </CardTitle>
        <CardDescription>
          Purchase credits to continue scraping.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup onValueChange={handlePackChange}>
          {CreditsPacks.map((pack) => (
            <div
              key={pack.id}
              className="flex items-center space-x-3 bg-secondary/50 rounded-lg p-3 hover:bg-secondary"
              onClick={() => handlePackChange(pack.id)}
            >
              <RadioGroupItem value={pack.id} id={pack.id} />
              <Label
                htmlFor={pack.id}
                className="flex justify-between w-full cursor-pointer"
              >
                <span className="font-medium">
                  {pack.name} - {pack.label}
                </span>
                <span className="font-bold text-primary">
                  {formatCurrency(pack.price)}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => mutation.mutate(selectedPack!)}
          disabled={mutation.isPending || !selectedPack}
        >
          <CreditCardIcon className="h-5 w-5 mr-2" />
          Purchase Credits
        </Button>
      </CardFooter>
    </Card>
  );
};

const formatCurrency = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price / 100);
};

export default CreditsPurchase;
