
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useDashboardContext = () => {
  const location = useLocation();

  const getCurrentDashboardId = useCallback((): string | null => {
    const pathParts = location.pathname.split('/');
    const dashboardIndex = pathParts.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathParts[dashboardIndex + 1]) {
      return decodeURIComponent(pathParts[dashboardIndex + 1]);
    }
    return null;
  }, [location]);

  return {
    currentDashboardId: getCurrentDashboardId()
  };
};
