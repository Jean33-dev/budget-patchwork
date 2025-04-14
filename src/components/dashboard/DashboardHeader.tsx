
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonthPicker } from "@/components/budget/MonthPicker";

interface DashboardHeaderProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  onBackClick: () => void;
  title?: string;
}

export function DashboardHeader({
  currentDate,
  onMonthChange,
  onBackClick,
  title = "Tableau de Bord"
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBackClick}
          className="rounded-full"
          aria-label="Retour"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      
      <MonthPicker 
        date={currentDate} 
        onDateChange={onMonthChange} 
      />
    </div>
  );
}
