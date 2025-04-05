
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export interface Dashboard {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

const DASHBOARDS_STORAGE_KEY = "custom_dashboards";

export const useDashboards = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les tableaux de bord au démarrage
  useEffect(() => {
    const loadDashboards = () => {
      try {
        const savedDashboards = localStorage.getItem(DASHBOARDS_STORAGE_KEY);
        if (savedDashboards) {
          setDashboards(JSON.parse(savedDashboards));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des tableaux de bord:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos tableaux de bord."
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboards();
  }, []);

  // Ajouter un nouveau tableau de bord
  const addDashboard = (dashboard: Omit<Dashboard, "id" | "createdAt">) => {
    try {
      const newDashboard: Dashboard = {
        ...dashboard,
        id: `dashboard_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      const updatedDashboards = [...dashboards, newDashboard];
      setDashboards(updatedDashboards);
      localStorage.setItem(DASHBOARDS_STORAGE_KEY, JSON.stringify(updatedDashboards));
      
      return newDashboard;
    } catch (error) {
      console.error("Erreur lors de l'ajout du tableau de bord:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le tableau de bord."
      });
      return null;
    }
  };

  // Supprimer un tableau de bord
  const deleteDashboard = (id: string) => {
    try {
      const updatedDashboards = dashboards.filter(dashboard => dashboard.id !== id);
      setDashboards(updatedDashboards);
      localStorage.setItem(DASHBOARDS_STORAGE_KEY, JSON.stringify(updatedDashboards));
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du tableau de bord:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le tableau de bord."
      });
      return false;
    }
  };

  return { dashboards, isLoading, addDashboard, deleteDashboard };
};
