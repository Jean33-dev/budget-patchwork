
import { v4 as uuidv4 } from 'uuid';

/**
 * Utility functions for dashboard ID management
 */

/**
 * Check if a route is a special route that doesn't directly contain a dashboard ID
 * @param route The route to check
 */
export const isSpecialRoute = (route: string): boolean => {
  const specialRoutes = ['budget', 'expenses', 'income', 'recurring-expenses', 'recurring-income', 'categories'];
  return specialRoutes.includes(route);
};

/**
 * Get the stored dashboard ID from localStorage
 */
export const getStoredDashboardId = (): string | null => {
  return localStorage.getItem('currentDashboardId');
};

/**
 * Store a dashboard ID in localStorage
 * @param id The dashboard ID to store
 */
export const storeDashboardId = (id: string): void => {
  localStorage.setItem('currentDashboardId', id);
};

/**
 * Generate a new dashboard ID
 */
export const generateNewDashboardId = (): string => {
  const newId = uuidv4();
  storeDashboardId(newId);
  return newId;
};
