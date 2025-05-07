
import { useState, useEffect, useRef } from "react";
import { db } from "@/services/database";
import { Dashboard } from "@/services/database/models/dashboard";

export const useDashboardLoading = (currentDashboardId: string) => {
  const [dashboardTitle, setDashboardTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  
  // Ref to track if dashboard creation is in progress to prevent race conditions
  const isCreatingDashboardRef = useRef(false);
  // Ref to track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      // Mark component as unmounted on cleanup
      isMountedRef.current = false;
    };
  }, []);

  const loadDashboards = async () => {
    try {
      await db.init();
      console.log("DashboardHeader: Chargement de tous les tableaux de bord...");
      const allDashboards = await db.getDashboards();
      console.log("DashboardHeader: Tableaux de bord chargés:", allDashboards);
      
      if (isMountedRef.current) {
        setDashboards(allDashboards);
      }
      
      return allDashboards;
    } catch (error) {
      console.error("DashboardHeader: Erreur lors du chargement des tableaux de bord:", error);
      return [];
    }
  };

  return {
    dashboardTitle,
    setDashboardTitle,
    isLoading,
    setIsLoading,
    dashboards,
    setDashboards,
    isCreatingDashboardRef,
    isMountedRef,
    loadDashboards
  };
};
