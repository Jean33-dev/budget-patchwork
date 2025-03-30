
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";

interface UseDataReloaderProps {
  loadData: () => Promise<void>;
  isLoading: boolean;
  isProcessing: boolean;
  initialNeedsReload?: boolean;
}

export const useDataReloader = ({ 
  loadData, 
  isLoading, 
  isProcessing, 
  initialNeedsReload = false 
}: UseDataReloaderProps) => {
  // État interne au hook pour gérer le rechargement
  const [needsReload, setNeedsReload] = useState(initialNeedsReload);
  
  // Réagir aux changements de initialNeedsReload
  useEffect(() => {
    if (initialNeedsReload) {
      setNeedsReload(true);
    }
  }, [initialNeedsReload]);
  
  // Effet pour recharger les données après une opération
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (needsReload && !isProcessing && !isLoading) {
      console.log("Programmation du rechargement automatique des données après opération");
      timer = setTimeout(async () => {
        try {
          console.log("Rechargement automatique des données après opération");
          await loadData();
        } catch (err) {
          console.error("Erreur lors du rechargement automatique des données:", err);
        } finally {
          setNeedsReload(false);
        }
      }, 500);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [needsReload, isProcessing, isLoading, loadData]);

  // Fonction pour forcer un rechargement manuel des données
  const forceReload = useCallback(async () => {
    if (isProcessing || isLoading) {
      toast({
        variant: "default",
        title: "Opération en cours",
        description: "Veuillez attendre la fin de l'opération en cours"
      });
      return;
    }
    
    console.log("Forçage du rechargement des données");
    
    try {
      await loadData();
      toast({
        title: "Données rechargées",
        description: "Les données ont été actualisées avec succès"
      });
    } catch (error) {
      console.error("Erreur lors du rechargement forcé des données:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de recharger les données"
      });
    }
  }, [isProcessing, isLoading, loadData]);

  return {
    needsReload,
    setNeedsReload,
    forceReload
  };
};
