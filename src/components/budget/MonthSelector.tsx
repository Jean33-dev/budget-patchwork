import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MonthSelectorProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
}

export const MonthSelector = ({ currentDate, onMonthChange }: MonthSelectorProps) => {
  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <Button variant="outline" size="icon" onClick={handlePreviousMonth} className="h-8 w-8 sm:h-9 sm:w-9">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-base sm:text-lg font-medium capitalize min-w-[120px] text-center">
        {format(currentDate, 'MMMM yyyy', { locale: fr })}
      </span>
      <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-8 w-8 sm:h-9 sm:w-9">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};