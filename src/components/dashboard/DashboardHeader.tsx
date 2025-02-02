import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MonthSelector } from "@/components/budget/MonthSelector";

interface DashboardHeaderProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  onBackClick: () => void;
}

export const DashboardHeader = ({ currentDate, onMonthChange, onBackClick }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onBackClick}
          className="shrink-0 h-8 w-8 sm:h-9 sm:w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl sm:text-4xl font-bold">Tableau de Bord Budget</h1>
      </div>
      <MonthSelector currentDate={currentDate} onMonthChange={onMonthChange} />
    </div>
  );
};