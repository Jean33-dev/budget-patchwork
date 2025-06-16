
import { useState, useEffect, useCallback } from "react";
import { db } from "@/services/database";
import { Income } from "@/services/database/models/income";
import { useToast } from "@/hooks/use-toast";
import { useDashboardContext } from "@/hooks/useDashboardContext";

export const useIncomeData = () => {
  const { toast } = useToast();
  const [envelopes, setEnvelopes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentDashboardId } = useDashboardContext();

  const loadIncomes = useCallback(async () => {
    setIsLoading(true);
    try {
      await db.init();
      const allIncomes = await db.getIncomes();
      
      console.log("useIncomeData - All incomes loaded:", allIncomes);
      console.log("useIncomeData - Current dashboardId:", currentDashboardId);
      
      // Filter incomes for the current dashboard with strict string comparison
      const filteredIncomes = allIncomes.filter(income => {
        // Normaliser les deux dashboardIds en strings
        const incomeDashboardId = income.dashboardId ? String(income.dashboardId) : "";
        const currentDashId = String(currentDashboardId || "");
        const match = incomeDashboardId === currentDashId;
        
        console.log(`🔍 Income filter: "${income.title}" (${incomeDashboardId || 'null'}) vs current "${currentDashId}" = ${match}`);
        return match;
      });
      
      console.log("useIncomeData - Filtered incomes:", filteredIncomes);
      setEnvelopes(filteredIncomes);
    } catch (error) {
      console.error("Erreur lors du chargement des revenus:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les revenus"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, currentDashboardId]);

  // Initialize the database and load incomes
  useEffect(() => {
    loadIncomes();
  }, [loadIncomes]);

  const refreshIncomes = useCallback(async () => {
    try {
      const allIncomes = await db.getIncomes();
      const filteredIncomes = allIncomes.filter(income => 
        String(income.dashboardId || "") === String(currentDashboardId || "")
      );
      setEnvelopes(filteredIncomes);
    } catch (error) {
      console.error("Error refreshing incomes:", error);
    }
  }, [currentDashboardId]);

  return {
    envelopes,
    isLoading,
    refreshIncomes
  };
};
