
import { useCallback, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { isSpecialRoute, getStoredDashboardId, storeDashboardId, generateNewDashboardId } from '../utils/dashboardUtils';

/**
 * Custom hook to manage and determine the current dashboard ID based on URL and localStorage
 */
export const useDashboardContext = () => {
  const location = useLocation();
  const { dashboardId } = useParams();

  /**
   * Extract a potential dashboard ID from the current URL path
   */
  const extractDashboardIdFromPath = useCallback((): string | null => {
    const pathParts = location.pathname.split('/');
    
    const dashboardIndex = pathParts.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathParts[dashboardIndex + 1]) {
      const potentialId = decodeURIComponent(pathParts[dashboardIndex + 1]);
      
      if (isSpecialRoute(potentialId)) {
        return null;
      }
      
      return potentialId;
    }
    
    return null;
  }, [location.pathname]);

  /**
   * Determine the current dashboard ID based on various sources
   */
  const getCurrentDashboardId = useCallback((): string => {
    // Priority 1: Use URL parameter if available and not a special route
    if (dashboardId) {
      if (isSpecialRoute(dashboardId)) {
        const storedId = getStoredDashboardId();
        if (storedId) {
          return storedId;
        }
      } else {
        storeDashboardId(dashboardId);
        return dashboardId;
      }
    }
    
    // Priority 2: Extract from URL path
    const pathId = extractDashboardIdFromPath();
    if (pathId) {
      storeDashboardId(pathId);
      return pathId;
    }
    
    // Priority 3: Use previously stored ID
    const storedId = getStoredDashboardId();
    if (storedId) {
      return storedId;
    }
    
    // Priority 4: Create new ID if none found
    return generateNewDashboardId();
  }, [dashboardId, extractDashboardIdFromPath]);

  // Determine and memoize the current dashboard ID
  const currentDashboardId = useMemo(() => {
    return getCurrentDashboardId();
  }, [getCurrentDashboardId]);

  return {
    currentDashboardId
  };
};
