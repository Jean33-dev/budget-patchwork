
import { Dashboard } from '../models/dashboard';
import { IQueryManager } from '../interfaces/IQueryManager';

/**
 * Manager for dashboard-related operations
 */
export class DashboardManager {
  private queryManager: IQueryManager;

  constructor(queryManager: IQueryManager) {
    this.queryManager = queryManager;
  }

  async getDashboards(): Promise<Dashboard[]> {
    return this.queryManager.executeGetDashboards();
  }

  async addDashboard(dashboard: Dashboard): Promise<void> {
    return this.queryManager.executeAddDashboard(dashboard);
  }

  async updateDashboard(dashboard: Dashboard): Promise<void> {
    return this.queryManager.executeUpdateDashboard(dashboard);
  }

  async deleteDashboard(id: string): Promise<void> {
    return this.queryManager.executeDeleteDashboard(id);
  }
}
