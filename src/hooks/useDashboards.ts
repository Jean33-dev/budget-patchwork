
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { Dashboard } from "@/services/database/models/dashboard";

export const useDashboards = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const MAX_LOAD_ATTEMPTS = 3;

  const loadDashboards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Increment attempt counter
      setLoadAttempts(prev => prev + 1);
      console.log(`Loading dashboards attempt ${loadAttempts + 1}/${MAX_LOAD_ATTEMPTS}`);
      
      // Initialize the database first
      console.log("Initializing database before loading dashboards");
      const initialized = await db.init();
      
      if (!initialized) {
        console.error("Failed to initialize database during loadDashboards");
        throw new Error("Failed to initialize database");
      }
      
      // Load dashboards
      console.log("Database initialized, loading dashboards");
      const dashboardsData = await db.getDashboards();
      console.log("Retrieved dashboards data:", dashboardsData);
      
      // If no dashboards exist, create the default dashboard
      if (!dashboardsData || dashboardsData.length === 0) {
        console.log("No dashboards found, creating default dashboard");
        
        const defaultDashboard: Dashboard = {
          id: 'default',
          title: 'Budget Personnel',
          createdAt: new Date().toISOString(),
          lastAccessed: new Date().toISOString()
        };
        
        console.log("Attempting to safely add default dashboard");
        const success = await db.safeAddDashboard(defaultDashboard);
        
        if (success) {
          console.log("Default dashboard created successfully");
          setDashboards([defaultDashboard]);
        } else {
          console.warn("Could not create default dashboard, trying to load existing ones");
          // Even if we couldn't add, try to load again in case another process added it
          const retryData = await db.getDashboards();
          
          if (retryData && retryData.length > 0) {
            console.log("Retrieved dashboards on retry:", retryData);
            setDashboards(retryData);
          } else {
            setDashboards([]); // Set empty array instead of throwing
            console.error("Could not create or find any dashboards");
          }
        }
      } else {
        console.log("Setting dashboards from database:", dashboardsData);
        setDashboards(dashboardsData);
      }
      
      return true;
    } catch (error) {
      console.error("Error loading dashboards:", error);
      setError(error instanceof Error ? error : new Error("Unknown error loading dashboards"));
      
      // Only show toast if we've exhausted all attempts
      if (loadAttempts >= MAX_LOAD_ATTEMPTS) {
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: "Impossible de charger les tableaux de bord après plusieurs tentatives"
        });
        return false;
      } else {
        // Try again after a short delay if we haven't hit max attempts
        setTimeout(() => {
          loadDashboards();
        }, 1000 * Math.pow(2, loadAttempts)); // Exponential backoff
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadAttempts]);

  // Load dashboards on component mount
  useEffect(() => {
    // Reset initialization attempts before loading
    db.resetInitializationAttempts?.();
    loadDashboards();
  }, [loadDashboards]);

  // Function to manually retry loading dashboards
  const retryLoadDashboards = useCallback(async () => {
    setLoadAttempts(0); // Reset attempts counter
    db.resetInitializationAttempts?.(); // Reset database initialization attempts
    return loadDashboards();
  }, [loadDashboards]);

  const addDashboard = async (title: string): Promise<string | null> => {
    try {
      const newDashboard: Dashboard = {
        id: `dashboard_${Date.now()}`,
        title: title,
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString()
      };
      
      await db.addDashboard(newDashboard);
      
      // Refresh dashboard list
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
      
      // Refresh dashboard list
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
      
      // Refresh dashboard list
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
    retryLoadDashboards,
    addDashboard,
    updateDashboard,
    deleteDashboard,
    loadAttempts,
    MAX_LOAD_ATTEMPTS
  };
};
