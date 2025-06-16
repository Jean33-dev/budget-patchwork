
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Income } from "@/services/database/models/income";
import { useDashboardContext } from "@/hooks/useDashboardContext";

export const useRecurringIncomeData = () => {
  const { toast } = useToast();
  const [recurringIncomes, setRecurringIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentDashboardId } = useDashboardContext();

  const loadRecurringIncomes = useCallback(async () => {
    setIsLoading(true);
    try {
      await db.init();
      const allIncomes = await db.getRecurringIncomes();
      
      // Filtrer par dashboardId
      const filteredIncomes = allIncomes.filter(income => {
        const incomeDashboardId = income.dashboardId ? String(income.dashboardId) : "";
        const currentDashId = String(currentDashboardId || "");
        const match = incomeDashboardId === currentDashId;
        
        console.log(`🔍 Recurring Income filter: "${income.title}" (${incomeDashboardId || 'null'}) vs current "${currentDashId}" = ${match}`);
        return match;
      });
      
      setRecurringIncomes(filteredIncomes);
      console.log("useRecurringIncomeData - Filtered recurring incomes:", filteredIncomes.length);
    } catch (error) {
      console.error("Erreur lors du chargement des revenus récurrents:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les revenus récurrents"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, currentDashboardId]);

  useEffect(() => {
    loadRecurringIncomes();
  }, [loadRecurringIncomes]);

  return {
    recurringIncomes,
    setRecurringIncomes,
    isLoading,
    loadRecurringIncomes
  };
};
