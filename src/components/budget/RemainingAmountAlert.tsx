
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowDown } from "lucide-react";
import { formatAmount } from "@/utils/format-amount";

interface RemainingAmountAlertProps {
  remainingAmount: number;
  currency?: "EUR" | "USD" | "GBP";
}

export const RemainingAmountAlert = ({ remainingAmount, currency = "EUR" }: RemainingAmountAlertProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-card p-4 rounded-lg border border-border/50 shadow-sm">
        <div className="flex items-center">
          <ArrowDown className={`h-4 w-4 mr-2 ${remainingAmount < 0 ? 'text-destructive' : 'text-blue-500'}`} />
          <div className={`text-sm font-medium ${remainingAmount < 0 ? 'text-destructive' : ''}`}>
            Revenu restant à répartir : {formatAmount(Number.isFinite(remainingAmount) ? remainingAmount : 0, currency)}
          </div>
        </div>
      </div>
      
      {remainingAmount < 0 && (
        <Alert variant="destructive" className="py-3">
          <AlertDescription>
            Le total des budgets dépasse vos revenus. Essayez de réduire certains budgets.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
