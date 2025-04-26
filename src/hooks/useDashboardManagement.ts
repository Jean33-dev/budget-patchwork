
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { v4 as uuidv4 } from 'uuid';

export interface Dashboard {
  id: string;
  title: string;
}

export const useDashboardManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);

  const loadDashboards = useCallback(async () => {
    try {
      await db.init();
      console.log("🔍 Home - Chargement des tableaux de bord...");
      const dashboardsData = await db.getDashboards();
      console.log("🔍 Home - Tableaux de bord chargés:", dashboardsData);
      setDashboards(dashboardsData);
    } catch (error) {
      console.error("🔍 Home - Erreur lors du chargement des tableaux de bord:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les tableaux de bord"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createDashboard = async (name: string) => {
    try {
      const newDashboardId = uuidv4();
      console.log("🔍 Home - Création d'un nouveau tableau de bord avec ID:", newDashboardId);
      
      const newDashboard = {
        id: newDashboardId,
        title: name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.addDashboard(newDashboard);
      await loadDashboards(); // Recharger les tableaux de bord après création
      
      localStorage.setItem('currentDashboardId', newDashboardId);
      navigate(`/dashboard/${newDashboardId}`);
      
      toast({
        title: "Succès",
        description: "Le tableau de bord a été créé",
      });
    } catch (error) {
      console.error("🔍 Home - Erreur lors de la création du tableau de bord:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le tableau de bord"
      });
      throw error;
    }
  };

  const updateDashboard = async (dashboardId: string, newTitle: string) => {
    try {
      console.log(`🔍 Home - Mise à jour du tableau de bord ${dashboardId} avec le titre "${newTitle}"`);
      const dashboard = await db.getDashboardById(dashboardId);
      if (dashboard) {
        await db.updateDashboard({
          ...dashboard,
          title: newTitle,
          updatedAt: new Date().toISOString()
        });
        
        await loadDashboards(); // Recharger les tableaux de bord après modification
        
        toast({
          title: "Succès",
          description: "Le tableau de bord a été modifié"
        });
      } else {
        console.error(`🔍 Home - Tableau de bord avec ID ${dashboardId} non trouvé`);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Tableau de bord non trouvé"
        });
      }
    } catch (error) {
      console.error("🔍 Home - Erreur lors de la modification du tableau de bord:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le tableau de bord"
      });
    }
  };

  const deleteDashboard = async (id: string) => {
    try {
      await db.deleteDashboard(id);
      await loadDashboards(); // Recharger les tableaux de bord après suppression
      
      toast({
        title: "Succès",
        description: "Le tableau de bord a été supprimé",
      });
    } catch (error) {
      console.error("🔍 Home - Erreur lors de la suppression du tableau de bord:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le tableau de bord"
      });
    }
  };

  useEffect(() => {
    loadDashboards();
  }, [loadDashboards]);

  return {
    dashboards,
    isLoading,
    loadDashboards,
    createDashboard,
    updateDashboard,
    deleteDashboard
  };
};
