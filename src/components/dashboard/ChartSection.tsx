
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
