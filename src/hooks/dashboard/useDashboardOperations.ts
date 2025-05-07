
import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/services/database";

export const useDashboardOperations = (
  currentDashboardId: string | null,
  setDashboardTitle: (title: string) => void,
  loadDashboards: () => Promise<any>,
  isCreatingDashboardRef: React.MutableRefObject<boolean>,
  isMountedRef: React.MutableRefObject<boolean>
) => {
  const { toast } = useToast();

  const updateDashboardTitle = useCallback(async (newTitle: string) => {
    try {
      if (!currentDashboardId) return;
      
      console.log("DashboardHeader: Mise à jour du tableau de bord avec ID:", currentDashboardId);
      console.log("DashboardHeader: Nouveau titre:", newTitle);
      
      const dashboard = await db.getDashboardById(currentDashboardId);
      
      if (dashboard) {
        await db.updateDashboard({
          ...dashboard,
          title: newTitle,
          updatedAt: new Date().toISOString()
        });
        
        setDashboardTitle(newTitle);
        console.log("DashboardHeader: Titre mis à jour avec succès:", newTitle);
        
        // Recharger la liste des tableaux de bord après modification
        await loadDashboards();
      } else {
        console.log("DashboardHeader: Tableau de bord non trouvé pour la mise à jour, vérification si création en cours...");
        
        // Only create if not already in progress
        if (!isCreatingDashboardRef.current) {
          isCreatingDashboardRef.current = true;
          try {
            console.log("DashboardHeader: Création d'un nouveau tableau de bord avec ID:", currentDashboardId);
            
            const now = new Date().toISOString();
            await db.addDashboard({
              id: currentDashboardId,
              title: newTitle,
              createdAt: now,
              updatedAt: now
            });
            
            setDashboardTitle(newTitle);
            
            // Recharger la liste des tableaux de bord après création
            await loadDashboards();
          } finally {
            isCreatingDashboardRef.current = false;
          }
        }
      }
    } catch (error) {
      console.error("DashboardHeader: Erreur lors de la mise à jour du titre:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du titre"
      });
    }
  }, [currentDashboardId, loadDashboards, setDashboardTitle, isCreatingDashboardRef, toast]);

  return {
    updateDashboardTitle
  };
};
