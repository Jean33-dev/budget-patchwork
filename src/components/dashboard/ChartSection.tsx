
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, PieChart, BarChart2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BudgetChart } from "../shared/BudgetChart";
import { ChartType } from "@/hooks/useChartData";

interface ChartSectionProps {
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  title: string;
  data: any[];
  totalIncome: number;
  addUnallocated: boolean;
}

export const ChartSection = ({ 
  chartType, 
  onChartTypeChange, 
  title, 
  data, 
  totalIncome, 
  addUnallocated 
}: ChartSectionProps) => {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-card to-card/95">
      <CardHeader className="border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            {chartType === "budget" ? (
              <PieChart className="h-4 w-4 text-muted-foreground mr-1 shrink-0" />
            ) : (
              <BarChart2 className="h-4 w-4 text-muted-foreground mr-1 shrink-0" />
            )}
            <CardTitle className="text-base sm:text-lg truncate">
              {title}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => onChartTypeChange("budget")}
                className={chartType === "budget" ? "bg-accent/40" : ""}
              >
                <PieChart className="h-4 w-4 mr-2" />
                Voir les budgets
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onChartTypeChange("category")}
                className={chartType === "category" ? "bg-accent/40" : ""}
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Voir les catégories
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="w-full overflow-hidden">
          <div className="min-w-[200px] h-[300px] sm:h-[350px]">
            <BudgetChart 
              data={data}
              totalIncome={totalIncome}
              addUnallocated={addUnallocated}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
