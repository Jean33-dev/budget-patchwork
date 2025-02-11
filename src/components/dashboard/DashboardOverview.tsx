
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetChart } from "../shared/BudgetChart";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface DashboardOverviewProps {
  totalIncome: number;
  totalExpenses: number;
  envelopes: Array<{
    id: string;
    title: string;
    budget: number;
    spent: number;
    type: "income" | "expense" | "budget";
    category?: string;
  }>;
}

type ChartType = "budget" | "category" | "type";

export const DashboardOverview = ({ totalIncome, totalExpenses, envelopes }: DashboardOverviewProps) => {
  const [chartType, setChartType] = useState<ChartType>("budget");
  const balance = totalIncome - totalExpenses;
  
  const budgetChartData = envelopes
    .filter(env => env.type === "budget")
    .map((env) => ({
      name: env.title,
      value: env.budget,
      type: env.type,
    }));

  const categoryChartData = envelopes
    .filter(env => env.type === "expense" && env.category)
    .reduce((acc, env) => {
      const categoryIndex = acc.findIndex(item => item.name === env.category);
      if (categoryIndex >= 0) {
        acc[categoryIndex].value += env.spent;
      } else if (env.category) {
        acc.push({
          name: env.category,
          value: env.spent,
          type: "expense" as const,
        });
      }
      return acc;
    }, [] as Array<{ name: string; value: number; type: "expense" }>);

  const budgetByCategoryData = [
    {
      name: "Nécessaire",
      value: envelopes
        .filter(env => env.type === "budget" && env.category === "necessaire")
        .reduce((sum, env) => sum + env.budget, 0),
      type: "budget" as const,
    },
    {
      name: "Plaisir",
      value: envelopes
        .filter(env => env.type === "budget" && env.category === "plaisir")
        .reduce((sum, env) => sum + env.budget, 0),
      type: "budget" as const,
    },
    {
      name: "Épargne",
      value: envelopes
        .filter(env => env.type === "budget" && env.category === "epargne")
        .reduce((sum, env) => sum + env.budget, 0),
      type: "budget" as const,
    },
  ];

  const getChartTitle = () => {
    switch (chartType) {
      case "budget":
        return "Répartition des Budgets";
      case "category":
        return "Répartition par Catégories";
      case "type":
        return "Répartition par Type de Catégorie";
      default:
        return "Répartition";
    }
  };

  const getChartData = () => {
    switch (chartType) {
      case "budget":
        return { data: budgetChartData, total: totalIncome };
      case "category":
        return { data: categoryChartData, total: totalExpenses };
      case "type":
        return { data: budgetByCategoryData, total: totalIncome };
      default:
        return { data: [], total: 0 };
    }
  };

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
            <CardTitle className="text-base sm:text-lg">
              {getChartTitle()}
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setChartType("budget")}>
                  Voir les budgets
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType("category")}>
                  Voir les catégories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType("type")}>
                  Voir par type de catégorie
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[300px] h-[300px] sm:h-[400px]">
              <BudgetChart 
                data={getChartData().data} 
                totalIncome={getChartData().total} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
