
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
    const normalizedDashboardId = String(currentDashboardId);
    
    return items.filter(item => {
      const itemDashboardId = item.dashboardId ? String(item.dashboardId) : "";
      return itemDashboardId === normalizedDashboardId;
    });
  }, []);

  return {
    filterByDashboardId
  };
};
