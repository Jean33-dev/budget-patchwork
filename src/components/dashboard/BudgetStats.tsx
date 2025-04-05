
import { Card } from "@/components/ui/card";

interface BudgetStatsProps {
  totalRevenues?: number;
  totalExpenses?: number;
  isLoading?: boolean;
  remainingBudget?: number;
  remainingBudgetAfterExpenses?: number;
}

export const BudgetStats = ({ 
  totalRevenues = 0, 
  totalExpenses = 0, 
  isLoading = false,
  remainingBudget = 0,
  remainingBudgetAfterExpenses = 0
}: BudgetStatsProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        {isLoading ? (
          <p className="text-blue-800 text-sm sm:text-base">
            Chargement des données...
          </p>
        ) : (
          <>
            <p className="text-blue-800 text-sm sm:text-base">
              Budget total : {totalRevenues.toFixed(2)} €
            </p>
            <p className="text-blue-800 text-sm sm:text-base">
              Dépenses totales : {totalExpenses.toFixed(2)} €
            </p>
            <p className="text-blue-800 text-sm sm:text-base">
              Budget restant après allocation : {remainingBudget.toFixed(2)} €
            </p>
            <p className="text-blue-800 text-sm sm:text-base">
              Budget restant : {remainingBudgetAfterExpenses.toFixed(2)} €
            </p>
          </>
        )}
      </div>
    </div>
  );
};
