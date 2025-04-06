import { Card } from "@/components/ui/card";

interface BudgetStatsProps {
  remainingBudget: number;
  remainingBudgetAfterExpenses: number;
}

export const BudgetStats = ({ remainingBudget, remainingBudgetAfterExpenses }: BudgetStatsProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <p className="text-blue-800 text-sm sm:text-base">
          Budget restant après allocation : {remainingBudget.toFixed(2)} €
        </p>
        <p className="text-blue-800 text-sm sm:text-base">
          Budget restant : {remainingBudgetAfterExpenses.toFixed(2)} €
        </p>
      </div>
    </div>
  );
};