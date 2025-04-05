
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BudgetChart } from "../shared/BudgetChart";
import { ChartType, useChartData } from "@/hooks/useChartData";
import { Budget } from "@/services/database/models/budget";
import { Expense } from "@/services/database/models/expense";

interface ChartSectionProps {
  budgets?: Budget[];
  expenses?: Expense[];
  isLoading?: boolean;
}

export const ChartSection = ({ 
  budgets = [], 
  expenses = [], 
  isLoading = false
}: ChartSectionProps) => {
  const [chartType, setChartType] = useState<ChartType>("budget");
  
  // Calculer le revenu total à partir des budgets
  const totalIncome = budgets
    .filter(b => b.type === 'income')
    .reduce((sum, b) => sum + Number(b.budget), 0);
  
  // Combiner les budgets et les dépenses pour les données du graphique
  const allEnvelopes = [
    ...budgets.map(b => ({
      id: b.id,
      title: b.title,
      budget: Number(b.budget),
      spent: Number(b.spent || 0),
      type: b.type,
    })),
    ...expenses.map(e => ({
      id: e.id,
      title: e.title,
      budget: Number(e.budget),
      spent: Number(e.spent || 0),
      type: e.type,
      linkedBudgetId: e.linkedBudgetId
    }))
  ];
  
  const { getChartData, getChartTitle } = useChartData(allEnvelopes, totalIncome);
  const { data, total, addUnallocated } = getChartData(chartType);
  
  const onChartTypeChange = (type: ChartType) => {
    setChartType(type);
  };

  const title = getChartTitle(chartType);

  // Si les données sont en cours de chargement, afficher un indicateur
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            Chargement des données...
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-6 min-h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Chargement du graphique...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <CardTitle className="text-base sm:text-lg">
            {title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onChartTypeChange("budget")}>
                Voir les budgets
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChartTypeChange("category")}>
                Voir les catégories
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[300px] h-[300px] sm:h-[400px]">
            <BudgetChart 
              data={data || []}
              totalIncome={total || 0}
              addUnallocated={addUnallocated || false}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
