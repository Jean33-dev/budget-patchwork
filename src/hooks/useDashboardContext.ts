
import { useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';

export const useDashboardContext = () => {
  const location = useLocation();
  const { dashboardId } = useParams();

  const getCurrentDashboardId = useCallback((): string => {
    // First, try to get dashboardId from route params
    if (dashboardId) {
      console.log("useDashboardContext - dashboardId from params:", dashboardId);
      return dashboardId;
    }

    // Fallback to pathname parsing if no params
    const pathParts = location.pathname.split('/');
    console.log("useDashboardContext - pathname:", location.pathname);
    console.log("useDashboardContext - pathParts:", pathParts);
    
    const dashboardIndex = pathParts.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathParts[dashboardIndex + 1]) {
      const specialRoutes = ['budget', 'expenses', 'income', 'recurring-expenses', 'recurring-income', 'categories'];
      
      const potentialId = decodeURIComponent(pathParts[dashboardIndex + 1]);
      console.log("useDashboardContext - potential dashboardId:", potentialId);
      
      // If it's a special route, return default
      if (specialRoutes.includes(potentialId)) {
        console.log("useDashboardContext - special route detected, returning default");
        return "default";
      }
      
      console.log("useDashboardContext - extracted valid dashboardId:", potentialId);
      return potentialId;
    }
    
    console.log("useDashboardContext - could not extract dashboardId, returning default");
    return "default";
  }, [location, dashboardId]);

  const currentDashboardId = getCurrentDashboardId();
  console.log("useDashboardContext - final currentDashboardId:", currentDashboardId);

  return {
    currentDashboardId
  };
};
