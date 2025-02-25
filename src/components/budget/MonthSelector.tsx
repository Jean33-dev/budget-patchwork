
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
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
  onNewMonthClick?: () => void;
}

export const MonthSelector = ({ currentDate, onMonthChange, onNewMonthClick }: MonthSelectorProps) => {
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
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1.5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-1.5 rounded-lg border">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handlePreviousMonth} 
                className="h-7 w-7"
                aria-label="Mois précédent"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mois précédent</p>
            </TooltipContent>
          </Tooltip>

          <span className="text-sm font-medium capitalize min-w-[110px] text-center px-1.5 py-1 bg-accent/50 rounded">
            {format(currentDate, 'MMM yyyy', { locale: fr })}
          </span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleNextMonth} 
                className="h-7 w-7"
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

        {onNewMonthClick && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                onClick={onNewMonthClick}
                className="gap-1.5 h-7 px-2 text-sm"
              >
                <CalendarDays className="h-4 w-4" />
                Nouveau mois
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Configurer la transition vers un nouveau mois</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};
