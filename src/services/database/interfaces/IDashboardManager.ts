
import { Dashboard } from '../models/dashboard';

/**
 * Interface defining dashboard operations
 */
export interface IDashboardManager {
  // Dashboard operations
  getDashboards(): Promise<Dashboard[]>;
  getDashboardById(id: string): Promise<Dashboard | null>;
  addDashboard(dashboard: Dashboard): Promise<void>;
  updateDashboard(dashboard: Dashboard): Promise<void>;
  deleteDashboard(id: string): Promise<void>;
  
  // Current dashboard operations
  getCurrentDashboardId(): string | null;
  setCurrentDashboardId(id: string): void;
}
