
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useDashboardContext = () => {
  const location = useLocation();

  const getCurrentDashboardId = useCallback((): string => {
    const pathParts = location.pathname.split('/');
    
    // Log pour déboguer
    console.log("useDashboardContext - pathname:", location.pathname);
    console.log("useDashboardContext - pathParts:", pathParts);
    
    const dashboardIndex = pathParts.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathParts[dashboardIndex + 1]) {
      // Les cas spéciaux à traiter - ces routes ne sont pas des IDs de dashboard
      const specialRoutes = ['budget', 'expenses', 'income', 'recurring-expenses', 'recurring-income', 'categories'];
      
      const potentialId = decodeURIComponent(pathParts[dashboardIndex + 1]);
      console.log("useDashboardContext - potential dashboardId:", potentialId);
      
      // Si c'est une route spéciale, retourner l'ID par défaut
      if (specialRoutes.includes(potentialId)) {
        console.log("useDashboardContext - special route detected, returning default");
        return "default";
      }
      
      console.log("useDashboardContext - extracted valid dashboardId:", potentialId);
      return potentialId;
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
