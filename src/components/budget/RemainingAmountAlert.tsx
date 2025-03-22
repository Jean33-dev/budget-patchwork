
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RemainingAmountAlertProps {
  remainingAmount: number;
}

export const RemainingAmountAlert = ({ remainingAmount }: RemainingAmountAlertProps) => {
  return (
    <div className="space-y-4">
      <div className={`text-sm font-medium ${remainingAmount < 0 ? 'text-red-500' : ''}`}>
        Montant restant à répartir : {Number.isFinite(remainingAmount) ? remainingAmount.toFixed(2) : "0.00"}€
      </div>
      {remainingAmount < 0 && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription>
            Le total des budgets dépasse vos revenus. Veuillez réduire certains budgets.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
