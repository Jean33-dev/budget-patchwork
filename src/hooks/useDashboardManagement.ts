
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { v4 as uuidv4 } from 'uuid';
import { Dashboard } from "@/services/database/models/dashboard"; // Import the correct Dashboard type

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
      
      const now = new Date().toISOString();
      const newDashboard: Dashboard = {
        id: newDashboardId,
        title: name,
        createdAt: now,
        updatedAt: now
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
      
      // Rechercher le dashboard d'abord dans notre état local
      let dashboard = dashboards.find(d => d.id === dashboardId);
      
      if (dashboard) {
        console.log(`🔍 Home - Dashboard trouvé dans l'état local:`, dashboard);
        
        // Mettre à jour le dashboard avec les données existantes
        const updatedDashboard: Dashboard = {
          ...dashboard,
          title: newTitle,
          updatedAt: new Date().toISOString()
        };
        
        await db.updateDashboard(updatedDashboard);
      } else {
        // Si pas trouvé dans l'état local, essayer de le récupérer directement depuis la base de données
        console.log(`🔍 Home - Dashboard non trouvé dans l'état local, recherche dans la base de données...`);
        const fetchedDashboard = await db.getDashboardById(dashboardId);
        
        if (fetchedDashboard) {
          console.log(`🔍 Home - Dashboard trouvé dans la base de données:`, fetchedDashboard);
          
          // Mettre à jour avec les données récupérées
          const updatedDashboard: Dashboard = {
            ...fetchedDashboard,
            title: newTitle,
            updatedAt: new Date().toISOString()
          };
          
          await db.updateDashboard(updatedDashboard);
        } else {
          // Si toujours pas trouvé, créer un nouveau dashboard avec cet ID
          console.log(`🔍 Home - Dashboard non trouvé, création d'un nouveau dashboard avec l'ID ${dashboardId}`);
          const now = new Date().toISOString();
          const newDashboard: Dashboard = {
            id: dashboardId,
            title: newTitle,
            createdAt: now,
            updatedAt: now
          };
          
          await db.addDashboard(newDashboard);
          toast({
            title: "Succès",
            description: "Nouveau tableau de bord créé"
          });
        }
      }
      
      await loadDashboards(); // Recharger les tableaux de bord après modification
      
      toast({
        title: "Succès",
        description: "Le tableau de bord a été modifié"
      });
      
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
