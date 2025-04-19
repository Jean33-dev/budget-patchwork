
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { db } from "@/services/database";

export interface Dashboard {
  id: string;
  title: string;
  createdAt: string;
  lastAccessed: string;
}

export const useDashboards = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const MAX_LOAD_ATTEMPTS = 3;
  
  const navigate = useNavigate();

  const loadDashboards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Loading dashboards attempt ${loadAttempts + 1}/${MAX_LOAD_ATTEMPTS}`);
      
      // Ensure database is initialized before loading dashboards
      console.log("Initializing database before loading dashboards");
      const initialized = await db.init();
      
      if (!initialized) {
        throw new Error("Failed to initialize database");
      }
      
      console.log("Database initialized, loading dashboards");
      
      // Get dashboards from database
      const dashboardsData = await db.getDashboards();
      console.log("Retrieved dashboards data:", dashboardsData);
      
      // Ensure default dashboard exists
      if (dashboardsData.length === 0) {
        console.log("No dashboards found, creating default dashboard");
        
        const defaultDashboard = {
          id: "default",
          title: "Budget Personnel",
          createdAt: new Date().toISOString(),
          lastAccessed: new Date().toISOString()
        };
        
        await db.safeAddDashboard(defaultDashboard);
        setDashboards([defaultDashboard]);
      } else {
        console.log("Setting dashboards from database:", dashboardsData);
        setDashboards(dashboardsData);
      }
      
      setLoadAttempts(0); // Reset attempt counter on success
    } catch (error) {
      console.error(`Error loading dashboards (attempt ${loadAttempts + 1}):`, error);
      setError(error instanceof Error ? error : new Error("Unknown error loading dashboards"));
      
      // Auto retry with exponential backoff
      if (loadAttempts < MAX_LOAD_ATTEMPTS - 1) {
        const nextAttempt = loadAttempts + 1;
        setLoadAttempts(nextAttempt);
        
        const delay = Math.min(1000 * Math.pow(2, nextAttempt), 8000);
        console.log(`Retrying in ${delay}ms (attempt ${nextAttempt + 1}/${MAX_LOAD_ATTEMPTS})...`);
        
        setTimeout(() => {
          loadDashboards();
        }, delay);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: "Impossible de charger les tableaux de bord après plusieurs tentatives."
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadAttempts, MAX_LOAD_ATTEMPTS]);

  const retryLoadDashboards = useCallback(async () => {
    console.log("Manually retrying dashboard load...");
    // Reset database initialization attempts
    db.resetInitializationAttempts?.();
    setLoadAttempts(0);
    await loadDashboards();
  }, [loadDashboards]);

  // Load dashboards on component mount
  useEffect(() => {
    loadDashboards();
  }, [loadDashboards]);

  return {
    dashboards,
    isLoading,
    error,
    retryLoadDashboards,
    loadAttempts,
    MAX_LOAD_ATTEMPTS
  };
};
