
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
  // Utiliser initialNeedsReload comme valeur initiale
  const [needsReload, setNeedsReload] = useState(initialNeedsReload);
  
  // Synchroniser needsReload avec initialNeedsReload quand celle-ci change
  useEffect(() => {
    if (initialNeedsReload && !needsReload) {
      setNeedsReload(true);
    }
  }, [initialNeedsReload, needsReload]);
  
  // Effet pour recharger les données après une opération
  useEffect(() => {
    if (needsReload && !isProcessing && !isLoading) {
      const timer = setTimeout(() => {
        console.log("Rechargement automatique des données après opération");
        loadData().catch(err => {
          console.error("Erreur lors du rechargement automatique des données:", err);
        });
        setNeedsReload(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
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
