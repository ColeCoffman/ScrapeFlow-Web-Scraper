import { getAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import { CoinsIcon, CreditCardIcon } from "lucide-react";
import CreditsPurchase from "./_components/CreditsPurchase";
import { Period } from "@/types/analytics";
import { getCreditsUsageInPeriod } from "@/actions/analytics/getCreditsUsageInPeriod";
import CreditsUsageChart from "./_components/CreditsUsageChart";
import { getUserPurchaseHistory } from "@/actions/billing/getUserPurchaseHistory";
import { format } from "date-fns";
import InvoiceButton from "./_components/InvoiceButton";

const BillingPage = () => {
  return (
    <div className="mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Billings</h1>
      <Suspense fallback={<Skeleton className="h-[166px] w-full" />}>
        <BalanceCard />
      </Suspense>
      <CreditsPurchase />
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <CreditsUsageCard />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <TransactionHistoryCard />
      </Suspense>
    </div>
  );
};

const BalanceCard = async () => {
  const balance = await getAvailableCredits();
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg flex justify-between flex-col overflow-hidden">
      <CardContent className="p-6 relative items-center">
        <div className="flex justify-between items-center">
          <div className="">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Available Credits
            </h3>
            <p className="text-4xl font-bold text-primary">
              <ReactCountUpWrapper value={balance} />
            </p>
          </div>
          <CoinsIcon
            size={140}
            className="text-primary opacity-20 absolute bottom-0 right-0"
          />
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        When credit balance runs out, your workflows will be paused.
      </CardFooter>
    </Card>
  );
};

const CreditsUsageCard = async () => {
  const period: Period = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  };

  const data = await getCreditsUsageInPeriod(period);

  return (
    <CreditsUsageChart
      data={data}
      title="Credits Consumed"
      description="Total credits consumed this month"
    />
  );
};

const TransactionHistoryCard = async () => {
  const transactions = await getUserPurchaseHistory();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CreditCardIcon className="w-6 h-6 text-primary" />
          Transaction History
        </CardTitle>
        <CardDescription>
          View and download your transaction history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.length === 0 && (
          <p className="text-muted-foreground">No transactions found</p>
        )}
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between items-center py-3 border-b last:border-b-0"
          >
            <div>
              <p className="font-medium">
                {format(transaction.date, "MMM dd, yyyy")}
              </p>
              <p className="text-sm text-muted-foreground">
                {transaction.description}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: transaction.currency,
                }).format(transaction.amount / 100)}
              </p>
              <InvoiceButton invoiceId={transaction.id} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BillingPage;
