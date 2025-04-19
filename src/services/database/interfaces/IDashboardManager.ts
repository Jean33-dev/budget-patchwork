
import { Dashboard } from '../models/dashboard';
import { IQueryManager } from './IQueryManager';

/**
 * Interface defining dashboard operations
 */
export interface IDashboardManager {
  // Database and initialization methods
  setDb(db: any): void;
  setInitialized(value: boolean): void;
  setQueryManager(queryManager: IQueryManager): this;

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
