
import { useCallback } from "react";

/**
 * Hook pour filtrer les données par tableau de bord
 */
export const useExpenseFiltering = () => {
  /**
   * Filtre les éléments par dashboardId
   * @param items Liste d'éléments avec un dashboardId optionnel
   * @param currentDashboardId ID du tableau de bord actuel
   */
  const filterByDashboardId = useCallback(<T extends { dashboardId?: string }>(
    items: T[],
    currentDashboardId: string
  ): T[] => {
    if (!currentDashboardId) {
      console.log("filterByDashboardId: aucun dashboardId fourni, retour de tous les éléments");
      return items;
    }
    
    const normalizedDashboardId = String(currentDashboardId);
    
    // Log pour débogage
    console.log(`filterByDashboardId: Filtrage pour dashboardId "${normalizedDashboardId}"`);
    console.log(`filterByDashboardId: ${items.length} éléments avant filtrage`);
    
    const filteredItems = items.filter(item => {
      const itemDashboardId = item.dashboardId ? String(item.dashboardId) : "";
      const isMatch = !itemDashboardId || itemDashboardId === normalizedDashboardId;
      
      // Logs détaillés pour les premiers éléments (limité pour éviter les logs trop verbeux)
      if (items.indexOf(item) < 5) {
        console.log(`Élément dashboardId: "${itemDashboardId}", match: ${isMatch}`);
      }
      
      return isMatch;
    });
    
    console.log(`filterByDashboardId: ${filteredItems.length} éléments après filtrage`);
    
    return filteredItems;
  }, []);

  return {
    filterByDashboardId
  };
};
