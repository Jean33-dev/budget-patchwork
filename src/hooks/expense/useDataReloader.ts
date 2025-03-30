
import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/services/database";

export const useDataReloader = (
  isProcessing: boolean,
  isLoading: boolean,
  loadData: () => Promise<void>
) => {
  const { toast } = useToast();

  const forceReload = useCallback(async () => {
    if (isProcessing || isLoading) {
      toast({
        title: "Opération en cours",
        description: "Veuillez attendre la fin de l'opération en cours"
      });
      return;
    }
    
    try {
      await loadData();
      toast({
        title: "Données rechargées",
        description: "Les données ont été actualisées avec succès"
      });
    } catch (error) {
      console.error("Error reloading data:", error);
    }
  }, [isProcessing, isLoading, loadData, toast]);

  return { forceReload };
};
