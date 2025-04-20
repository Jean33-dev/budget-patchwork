
import { useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export const useDashboardContext = () => {
  const location = useLocation();
  const { dashboardId } = useParams();

  const getCurrentDashboardId = useCallback((): string => {
    console.log("🔍 useDashboardContext - Starting with dashboardId param:", dashboardId);
    console.log("🔍 useDashboardContext - location pathname:", location.pathname);
    
    if (dashboardId) {
      // Traiter les cas spéciaux comme "budget" directement
      if (dashboardId === "budget") {
        console.log("🔍 useDashboardContext - Special 'budget' route detected");
        return "budget";
      }
      
      console.log("🔍 useDashboardContext - Using dashboardId from params:", dashboardId);
      return dashboardId;
    }

    const pathParts = location.pathname.split('/');
    console.log("🔍 useDashboardContext - pathname parts:", pathParts);
    
    const dashboardIndex = pathParts.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathParts[dashboardIndex + 1]) {
      const specialRoutes = ['budget', 'expenses', 'income', 'recurring-expenses', 'recurring-income', 'categories'];
      const potentialId = decodeURIComponent(pathParts[dashboardIndex + 1]);
      console.log("🔍 useDashboardContext - Found potential dashboardId in path:", potentialId);
      
      if (specialRoutes.includes(potentialId)) {
        console.log("🔍 useDashboardContext - This is a special route:", potentialId);
        
        if (potentialId === 'budget') {
          console.log("🔍 useDashboardContext - On budget route, returning 'budget'");
          return 'budget';
        }
        
        // Pour les autres routes spéciales, utiliser le dashboardId par défaut
        const defaultId = localStorage.getItem('defaultDashboardId') || uuidv4();
        if (!localStorage.getItem('defaultDashboardId')) {
          console.log("🔍 useDashboardContext - Creating new defaultDashboardId:", defaultId);
          localStorage.setItem('defaultDashboardId', defaultId);
        } else {
          console.log("🔍 useDashboardContext - Using existing defaultDashboardId:", defaultId);
        }
        
        return defaultId;
      }
      
      console.log("🔍 useDashboardContext - Returning ID from path:", potentialId);
      return potentialId;
    }
    
    // Generate a unique ID for the default dashboard if it doesn't exist
    const defaultId = localStorage.getItem('defaultDashboardId') || uuidv4();
    if (!localStorage.getItem('defaultDashboardId')) {
      console.log("🔍 useDashboardContext - Creating new defaultDashboardId:", defaultId);
      localStorage.setItem('defaultDashboardId', defaultId);
    } else {
      console.log("🔍 useDashboardContext - Using existing defaultDashboardId:", defaultId);
    }
    
    console.log("🔍 useDashboardContext - No dashboardId found in path, using default:", defaultId);
    return defaultId;
  }, [location, dashboardId]);

  const currentDashboardId = getCurrentDashboardId();
  console.log("🔍 useDashboardContext - Final currentDashboardId:", currentDashboardId);

  return {
    currentDashboardId
  };
};
