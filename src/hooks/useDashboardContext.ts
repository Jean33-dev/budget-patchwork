
import { useCallback, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom hook to manage and determine the current dashboard ID based on URL and localStorage
 */
export const useDashboardContext = () => {
  const location = useLocation();
  const { dashboardId } = useParams();

  /**
   * Check if a route is a special route that doesn't directly contain a dashboard ID
   * @param route The route to check
   */
  const isSpecialRoute = useCallback((route: string): boolean => {
    const specialRoutes = ['budget', 'expenses', 'income', 'recurring-expenses', 'recurring-income', 'categories'];
    return specialRoutes.includes(route);
  }, []);

  /**
   * Get the stored dashboard ID from localStorage
   */
  const getStoredDashboardId = useCallback((): string | null => {
    return localStorage.getItem('currentDashboardId');
  }, []);

  /**
   * Store a dashboard ID in localStorage
   * @param id The dashboard ID to store
   */
  const storeDashboardId = useCallback((id: string): void => {
    localStorage.setItem('currentDashboardId', id);
    console.log("🔍 useDashboardContext - Stored dashboardId:", id);
  }, []);

  /**
   * Extract a potential dashboard ID from the current URL path
   */
  const extractDashboardIdFromPath = useCallback((): string | null => {
    const pathParts = location.pathname.split('/');
    console.log("🔍 useDashboardContext - pathname parts:", pathParts);
    
    const dashboardIndex = pathParts.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathParts[dashboardIndex + 1]) {
      const potentialId = decodeURIComponent(pathParts[dashboardIndex + 1]);
      console.log("🔍 useDashboardContext - Found potential dashboardId in path:", potentialId);
      
      if (isSpecialRoute(potentialId)) {
        console.log("🔍 useDashboardContext - This is a special route:", potentialId);
        return null;
      }
      
      return potentialId;
    }
    
    return null;
  }, [location.pathname, isSpecialRoute]);

  /**
   * Generate a new dashboard ID
   */
  const generateNewDashboardId = useCallback((): string => {
    const newId = uuidv4();
    console.log("🔍 useDashboardContext - Creating new dashboardId:", newId);
    storeDashboardId(newId);
    return newId;
  }, [storeDashboardId]);

  /**
   * Determine the current dashboard ID based on various sources
   */
  const getCurrentDashboardId = useCallback((): string => {
    console.log("🔍 useDashboardContext - Starting with dashboardId param:", dashboardId);
    console.log("🔍 useDashboardContext - location pathname:", location.pathname);
    
    // Priority 1: Use URL parameter if available and not a special route
    if (dashboardId) {
      if (isSpecialRoute(dashboardId)) {
        console.log("🔍 useDashboardContext - Special route detected in URL params:", dashboardId);
        const storedId = getStoredDashboardId();
        if (storedId) {
          console.log("🔍 useDashboardContext - Using stored dashboardId:", storedId);
          return storedId;
        }
      } else {
        console.log("🔍 useDashboardContext - Using dashboardId from params:", dashboardId);
        storeDashboardId(dashboardId);
        return dashboardId;
      }
    }
    
    // Priority 2: Extract from URL path
    const pathId = extractDashboardIdFromPath();
    if (pathId) {
      storeDashboardId(pathId);
      console.log("🔍 useDashboardContext - Using ID from path:", pathId);
      return pathId;
    }
    
    // Priority 3: Use previously stored ID
    const storedId = getStoredDashboardId();
    if (storedId) {
      console.log("🔍 useDashboardContext - Using previously stored dashboardId:", storedId);
      return storedId;
    }
    
    // Priority 4: Create new ID if none found
    return generateNewDashboardId();
  }, [
    dashboardId, 
    location, 
    isSpecialRoute, 
    getStoredDashboardId, 
    extractDashboardIdFromPath, 
    storeDashboardId, 
    generateNewDashboardId
  ]);

  // Determine and memoize the current dashboard ID
  const currentDashboardId = useMemo(() => {
    const id = getCurrentDashboardId();
    console.log("🔍 useDashboardContext - Final currentDashboardId:", id);
    return id;
  }, [getCurrentDashboardId]);

  return {
    currentDashboardId
  };
};
