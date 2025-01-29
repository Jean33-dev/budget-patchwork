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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onBackClick}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-4xl font-bold">Tableau de Bord Budget</h1>
      </div>
      <MonthSelector currentDate={currentDate} onMonthChange={onMonthChange} />
    </div>
  );
};