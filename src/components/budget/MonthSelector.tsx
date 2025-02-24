
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
import { useEffect, useState } from "react";
import { db } from "@/services/database";
import type { BudgetPeriod } from "@/types/budget-period";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthSelectorProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  onNewMonthClick?: () => void;
}

export const MonthSelector = ({ currentDate, onMonthChange, onNewMonthClick }: MonthSelectorProps) => {
  const [periods, setPeriods] = useState<BudgetPeriod[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<BudgetPeriod | null>(null);

  useEffect(() => {
    const loadPeriods = async () => {
      try {
        // Utiliser la méthode publique getCurrentPeriod au lieu d'accéder directement à db
        const current = await db.getCurrentPeriod();
        setCurrentPeriod(current);

        // Créer une requête pour obtenir toutes les périodes
        const allPeriods = await getAllPeriods();
        setPeriods(allPeriods);
      } catch (error) {
        console.error("Erreur lors du chargement des périodes:", error);
      }
    };

    loadPeriods();
  }, []);

  const getAllPeriods = async (): Promise<BudgetPeriod[]> => {
    return new Promise((resolve) => {
      const stmt = db.prepare("SELECT * FROM budget_periods ORDER BY startDate DESC");
      const results: BudgetPeriod[] = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject() as any);
      }
      stmt.free();
      resolve(results);
    });
  };

  const handlePeriodChange = (periodId: string) => {
    const period = periods.find(p => p.id === periodId);
    if (period) {
      onMonthChange(new Date(period.startDate));
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1.5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-1.5 rounded-lg border">
          <Select
            value={currentPeriod?.id}
            onValueChange={handlePeriodChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period.id} value={period.id}>
                  {period.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
