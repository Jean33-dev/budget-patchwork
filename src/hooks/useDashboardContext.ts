
import { useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export const useDashboardContext = () => {
  const location = useLocation();
  const { dashboardId } = useParams();

  const getCurrentDashboardId = useCallback((): string => {
    if (dashboardId) {
      console.log("useDashboardContext - dashboardId from params:", dashboardId);
      return dashboardId;
    }

    const pathParts = location.pathname.split('/');
    console.log("useDashboardContext - pathname:", location.pathname);
    
    const dashboardIndex = pathParts.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathParts[dashboardIndex + 1]) {
      const specialRoutes = ['budget', 'expenses', 'income', 'recurring-expenses', 'recurring-income', 'categories'];
      const potentialId = decodeURIComponent(pathParts[dashboardIndex + 1]);
      
      if (specialRoutes.includes(potentialId)) {
        // Generate a unique ID for the default dashboard if it doesn't exist
        const defaultId = localStorage.getItem('defaultDashboardId') || uuidv4();
        if (!localStorage.getItem('defaultDashboardId')) {
          localStorage.setItem('defaultDashboardId', defaultId);
        }
        return defaultId;
      }
      
      return potentialId;
    }
    
    // Generate a unique ID for the default dashboard if it doesn't exist
    const defaultId = localStorage.getItem('defaultDashboardId') || uuidv4();
    if (!localStorage.getItem('defaultDashboardId')) {
      localStorage.setItem('defaultDashboardId', defaultId);
    }
    return defaultId;
  }, [location, dashboardId]);

  const currentDashboardId = getCurrentDashboardId();
  console.log("useDashboardContext - final currentDashboardId:", currentDashboardId);

  return {
    currentDashboardId
  };
};
