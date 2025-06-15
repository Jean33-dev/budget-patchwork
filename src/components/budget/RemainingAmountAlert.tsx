
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowDown } from "lucide-react";
import { formatAmount } from "@/utils/format-amount";
import { useTheme } from "@/context/ThemeContext";

interface RemainingAmountAlertProps {
  remainingAmount: number;
  currency?: "EUR" | "USD" | "GBP";
}

export const RemainingAmountAlert = ({ remainingAmount, currency = "EUR" }: RemainingAmountAlertProps) => {
  const { t } = useTheme();
  return (
    <div className="space-y-4">
      <div className="bg-card p-4 rounded-lg border border-border/50 shadow-sm">
        <div className="flex items-center">
          <ArrowDown className={`h-4 w-4 mr-2 ${remainingAmount < 0 ? 'text-destructive' : 'text-blue-500'}`} />
          <div className={`text-sm font-medium ${remainingAmount < 0 ? 'text-destructive' : ''}`}>
            {t("stats.remainingIncome")}: {formatAmount(Number.isFinite(remainingAmount) ? remainingAmount : 0, currency)}
          </div>
        </div>
      </div>
      
      {remainingAmount < 0 && (
        <Alert variant="destructive" className="py-3">
          <AlertDescription>
            {t("budgets.remainingError") || "Le total des budgets dépasse vos revenus. Essayez de réduire certains budgets."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
