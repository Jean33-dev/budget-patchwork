
import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

interface BudgetStatsProps {
  remainingBudget: number;
  remainingBudgetAfterExpenses: number;
}

export const BudgetStats = ({ remainingBudget, remainingBudgetAfterExpenses }: BudgetStatsProps) => {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/30">
          <div className="p-4 sm:p-6 flex flex-col">
            <span className="text-sm text-muted-foreground mb-1.5 flex items-center">
              <ArrowDown className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
              Revenu restant à répartir
            </span>
            <span className={`text-lg sm:text-xl font-semibold ${remainingBudget < 0 ? 'text-red-500' : 'text-blue-800'}`}>
              {remainingBudget.toFixed(2)} €
            </span>
          </div>
          
          <div className="p-4 sm:p-6 flex flex-col">
            <span className="text-sm text-muted-foreground mb-1.5 flex items-center">
              <ArrowUp className="h-3.5 w-3.5 mr-1.5 text-green-500" />
              Budget restant
            </span>
            <span className={`text-lg sm:text-xl font-semibold ${remainingBudgetAfterExpenses < 0 ? 'text-red-500' : 'text-blue-800'}`}>
              {remainingBudgetAfterExpenses.toFixed(2)} €
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
