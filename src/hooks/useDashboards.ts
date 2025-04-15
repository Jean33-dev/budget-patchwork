
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { Dashboard } from "@/services/database/models/dashboard";

export const useDashboards = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDashboards = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Initialiser la base de données si nécessaire
      const initialized = await db.init();
      if (!initialized) {
        throw new Error("Failed to initialize database");
      }
      
      // Charger les tableaux de bord
      const dashboardsData = await db.getDashboards();
      console.log("Retrieved dashboards data:", dashboardsData);
      
      // Si aucun tableau de bord n'existe, créer le tableau de bord par défaut
      if (!dashboardsData || dashboardsData.length === 0) {
        console.log("No dashboards found, creating default dashboard");
        try {
          const defaultDashboard: Dashboard = {
            id: 'default',
            title: 'Budget Personnel',
            createdAt: new Date().toISOString(),
            lastAccessed: new Date().toISOString()
          };
          
          await db.addDashboard(defaultDashboard);
          setDashboards([defaultDashboard]);
        } catch (dashboardError) {
          // Si nous avons une erreur lors de la création, c'est peut-être parce qu'il existe déjà
          console.error("Error adding dashboard:", dashboardError);
          
          // Essayer de récupérer à nouveau les tableaux de bord
          const retryData = await db.getDashboards();
          if (retryData && retryData.length > 0) {
            console.log("Retrieved dashboards on retry:", retryData);
            setDashboards(retryData);
          } else {
            throw dashboardError;
          }
        }
      } else {
        console.log("Setting dashboards:", dashboardsData);
        setDashboards(dashboardsData);
      }
    } catch (error) {
      console.error("Error loading dashboards:", error);
      setError(error instanceof Error ? error : new Error("Unknown error"));
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les tableaux de bord"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les tableaux de bord au montage du composant
  useEffect(() => {
    loadDashboards();
  }, []);

  const addDashboard = async (title: string): Promise<string | null> => {
    try {
      const newDashboard: Dashboard = {
        id: `dashboard_${Date.now()}`,
        title: title,
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString()
      };
      
      await db.addDashboard(newDashboard);
      
      // Rafraîchir la liste des tableaux de bord
      await loadDashboards();
      
      toast({
        title: "Tableau de bord créé",
        description: `Le tableau de bord "${title}" a été créé avec succès.`
      });
      
      return newDashboard.id;
    } catch (error) {
      console.error("Error adding dashboard:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le tableau de bord"
      });
      return null;
    }
  };

  const updateDashboard = async (dashboard: Dashboard): Promise<boolean> => {
    try {
      await db.updateDashboard({
        ...dashboard,
        lastAccessed: new Date().toISOString()
      });
      
      // Rafraîchir la liste des tableaux de bord
      await loadDashboards();
      
      return true;
    } catch (error) {
      console.error("Error updating dashboard:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le tableau de bord"
      });
      return false;
    }
  };

  const deleteDashboard = async (id: string): Promise<boolean> => {
    try {
      await db.deleteDashboard(id);
      
      // Rafraîchir la liste des tableaux de bord
      await loadDashboards();
      
      toast({
        title: "Tableau de bord supprimé",
        description: "Le tableau de bord a été supprimé avec succès."
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting dashboard:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le tableau de bord"
      });
      return false;
    }
  };

  return {
    dashboards,
    isLoading,
    error,
    loadDashboards,
    addDashboard,
    updateDashboard,
    deleteDashboard
  };
};
