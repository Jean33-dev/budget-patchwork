
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Budget } from "@/services/database/models/budget";
import { Expense } from "@/services/database/models/expense";

interface OverviewStatsProps {
  totalIncome?: number;
  totalExpenses?: number;
  balance?: number;
  budgets?: Budget[];
  expenses?: Expense[];
  onManageBudgets?: () => void;
  onManageExpenses?: () => void;
  onManageIncomes?: () => void;
  onManageCategories?: () => void;
  isLoading?: boolean;
}

export const OverviewStats = ({
  totalIncome = 0,
  totalExpenses = 0,
  balance = 0,
  budgets = [],
  expenses = [],
  onManageBudgets,
  onManageExpenses,
  onManageIncomes,
  onManageCategories,
  isLoading = false
}: OverviewStatsProps) => {
  // Calcul du solde si non fourni
  const calculatedBalance = balance || (totalIncome - totalExpenses);
  
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="p-2">
        <CardContent className="flex items-center justify-between p-2">
          <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
          <div className="text-lg font-bold text-budget-income">{totalIncome.toFixed(2)} €</div>
        </CardContent>
      </Card>
      <Card className="p-2">
        <CardContent className="flex items-center justify-between p-2">
          <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
          <div className="text-lg font-bold text-budget-expense">{totalExpenses.toFixed(2)} €</div>
        </CardContent>
      </Card>
      <Card className="p-2 sm:col-span-2 lg:col-span-1">
        <CardContent className="flex items-center justify-between p-2">
          <CardTitle className="text-sm font-medium">Solde</CardTitle>
          <div className={`text-lg font-bold ${calculatedBalance >= 0 ? "text-budget-income" : "text-budget-expense"}`}>
            {calculatedBalance >= 0 ? Math.abs(calculatedBalance).toFixed(2) : `-${Math.abs(calculatedBalance).toFixed(2)}`} €
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
