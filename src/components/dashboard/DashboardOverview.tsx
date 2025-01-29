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
    .filter(env => env.type !== "budget")
    .map((env) => ({
      name: env.title,
      value: env.type === "income" ? env.budget : env.spent,
      type: env.type,
    }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-budget-income">{totalIncome.toFixed(2)} €</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-budget-expense">{totalExpenses.toFixed(2)} €</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? "text-budget-income" : "text-budget-expense"}`}>
              {Math.abs(balance).toFixed(2)} €
              <span className="text-sm font-normal text-gray-500 ml-2">
                {balance >= 0 ? "Restant" : "Dépassement"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 justify-end">
        <Button 
          variant="outline"
          onClick={() => navigate("/dashboard/budget/income")}
        >
          Gérer les Revenus
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate("/dashboard/budget/budgets")}
        >
          Gérer les Budgets
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate("/dashboard/budget/expenses")}
        >
          Gérer les Dépenses
        </Button>
      </div>

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Aperçu du Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <BudgetChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
};