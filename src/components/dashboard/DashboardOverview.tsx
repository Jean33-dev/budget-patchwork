
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetChart } from "../shared/BudgetChart";
import { Button } from "@/components/ui/button";
import { MoreVertical, ChartPie, ChartBar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
          <div className="flex items-center space-x-2">
            <CardTitle className="text-base sm:text-lg">Répartition des Budgets</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <ChartPie className="mr-2 h-4 w-4" />
                  Graphique Circulaire
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ChartBar className="mr-2 h-4 w-4" />
                  Graphique en Barres
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
