
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <div className="flex items-center gap-2 sm:gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 rounded-lg border">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePreviousMonth} 
              className="h-8 w-8 sm:h-9 sm:w-9"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Mois précédent</p>
          </TooltipContent>
        </Tooltip>

        <span className="text-base sm:text-lg font-medium capitalize min-w-[140px] text-center px-2 py-1 bg-accent/50 rounded">
          {format(currentDate, 'MMMM yyyy', { locale: fr })}
        </span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNextMonth} 
              className="h-8 w-8 sm:h-9 sm:w-9"
              aria-label="Mois suivant"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Mois suivant</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
