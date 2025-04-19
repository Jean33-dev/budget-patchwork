
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useDashboardContext = () => {
  const location = useLocation();

  const getCurrentDashboardId = useCallback((): string | null => {
    const pathParts = location.pathname.split('/');
    
    // Log pour déboguer
    console.log("useDashboardContext - pathname:", location.pathname);
    console.log("useDashboardContext - pathParts:", pathParts);
    
    const dashboardIndex = pathParts.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathParts[dashboardIndex + 1]) {
      const dashboardId = decodeURIComponent(pathParts[dashboardIndex + 1]);
      console.log("useDashboardContext - extracted dashboardId:", dashboardId);
      return dashboardId;
    }
    console.log("useDashboardContext - could not extract dashboardId, returning default");
    return "default";  // Retourner l'ID du dashboard par défaut si aucun n'est trouvé
  }, [location]);

  const currentDashboardId = getCurrentDashboardId();
  console.log("useDashboardContext - final currentDashboardId:", currentDashboardId);

  return {
    currentDashboardId
  };
};
