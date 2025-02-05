import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BudgetChart } from "../shared/BudgetChart";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-3 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-sm sm:text-base font-medium">Revenus Totaux</CardTitle>
          </CardHeader>
          <CardContent className="pb-2 sm:pb-3">
            <div className="text-lg sm:text-xl font-bold text-budget-income">{totalIncome.toFixed(2)} €</div>
          </CardContent>
        </Card>
        <Card className="p-3 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-sm sm:text-base font-medium">Dépenses Totales</CardTitle>
          </CardHeader>
          <CardContent className="pb-2 sm:pb-3">
            <div className="text-lg sm:text-xl font-bold text-budget-expense">{totalExpenses.toFixed(2)} €</div>
          </CardContent>
        </Card>
        <Card className="p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-sm sm:text-base font-medium">Solde</CardTitle>
          </CardHeader>
          <CardContent className="pb-2 sm:pb-3">
            <div className={`text-lg sm:text-xl font-bold ${balance >= 0 ? "text-budget-income" : "text-budget-expense"}`}>
              {Math.abs(balance).toFixed(2)} €
              <span className="text-xs sm:text-sm font-normal text-gray-500 ml-2">
                {balance >= 0 ? "Restant" : "Dépassement"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        <Button 
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => navigate("/dashboard/budget/income")}
        >
          Gérer les Revenus
        </Button>
        <Button 
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => navigate("/dashboard/budget/categories")}
        >
          Gérer les Catégories
        </Button>
        <Button 
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => navigate("/dashboard/budget/budgets")}
        >
          Gérer les Budgets
        </Button>
        <Button 
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => navigate("/dashboard/budget/expenses")}
        >
          Gérer les Dépenses
        </Button>
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