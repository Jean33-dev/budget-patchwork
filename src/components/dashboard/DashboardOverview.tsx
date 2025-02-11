
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetChart } from "../shared/BudgetChart";

interface DashboardOverviewProps {
  totalIncome: number;
  totalExpenses: number;
  envelopes: Array<{
    id: string;
    title: string;
    budget: number;
    spent: number;
    type: "income" | "expense" | "budget";
  }>;
}

export const DashboardOverview = ({ totalIncome, totalExpenses, envelopes }: DashboardOverviewProps) => {
  const balance = totalIncome - totalExpenses;
  
  const chartData = envelopes
    .filter(env => env.type === "budget")
    .map((env) => ({
      name: env.title,
      value: env.budget,
      type: env.type,
    }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
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
              <div className="flex items-center">
                <span className={`text-lg font-bold ${balance >= 0 ? "text-budget-income" : "text-budget-expense"}`}>
                  {Math.abs(balance).toFixed(2)} €
                </span>
                <span className="text-xs font-normal text-gray-500 ml-2">
                  {balance >= 0 ? "Restant" : "Dépassement"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Répartition des Budgets</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[300px] h-[300px] sm:h-[400px]">
              <BudgetChart data={chartData} totalIncome={totalIncome} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
