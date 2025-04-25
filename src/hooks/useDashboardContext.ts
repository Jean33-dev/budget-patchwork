
import { useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export const useDashboardContext = () => {
  const location = useLocation();
  const { dashboardId } = useParams();

  const getCurrentDashboardId = useCallback((): string => {
    console.log("🔍 useDashboardContext - Starting with dashboardId param:", dashboardId);
    console.log("🔍 useDashboardContext - location pathname:", location.pathname);
    
    // Priorité 1: Utiliser l'ID du dashboard des paramètres d'URL
    if (dashboardId) {
      // Traiter les cas spéciaux comme "budget" directement
      if (dashboardId === "budget") {
        console.log("🔍 useDashboardContext - Special 'budget' route detected");
        // Dans ce cas, on utilise l'ID stocké dans localStorage
        const storedId = localStorage.getItem('currentDashboardId');
        if (storedId) {
          console.log("🔍 useDashboardContext - Using stored dashboardId:", storedId);
          return storedId;
        }
      } else {
        console.log("🔍 useDashboardContext - Using dashboardId from params:", dashboardId);
        // Stocker l'ID courant pour référence future
        localStorage.setItem('currentDashboardId', dashboardId);
        return dashboardId;
      }
    }

    // Priorité 2: Extraire l'ID du dashboard du chemin URL
    const pathParts = location.pathname.split('/');
    console.log("🔍 useDashboardContext - pathname parts:", pathParts);
    
    const dashboardIndex = pathParts.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathParts[dashboardIndex + 1]) {
      const specialRoutes = ['budget', 'expenses', 'income', 'recurring-expenses', 'recurring-income', 'categories'];
      const potentialId = decodeURIComponent(pathParts[dashboardIndex + 1]);
      console.log("🔍 useDashboardContext - Found potential dashboardId in path:", potentialId);
      
      if (specialRoutes.includes(potentialId)) {
        console.log("🔍 useDashboardContext - This is a special route:", potentialId);
        
        // Pour les routes spéciales, utiliser l'ID stocké précédemment
        const storedId = localStorage.getItem('currentDashboardId');
        if (storedId) {
          console.log("🔍 useDashboardContext - Using stored dashboardId:", storedId);
          return storedId;
        }
      } else {
        // Stocker l'ID courant pour référence future
        localStorage.setItem('currentDashboardId', potentialId);
        console.log("🔍 useDashboardContext - Returning ID from path:", potentialId);
        return potentialId;
      }
    }
    
    // Priorité 3: Utiliser l'ID stocké dans localStorage
    const storedId = localStorage.getItem('currentDashboardId');
    if (storedId) {
      console.log("🔍 useDashboardContext - Using previously stored dashboardId:", storedId);
      return storedId;
    }
    
    // Priorité 4: Générer un nouvel ID si aucun n'est disponible
    const newId = uuidv4();
    console.log("🔍 useDashboardContext - Creating new dashboardId:", newId);
    localStorage.setItem('currentDashboardId', newId);
    
    return newId;
  }, [location, dashboardId]);

  const currentDashboardId = getCurrentDashboardId();
  console.log("🔍 useDashboardContext - Final currentDashboardId:", currentDashboardId);

  return {
    currentDashboardId
  };
};
