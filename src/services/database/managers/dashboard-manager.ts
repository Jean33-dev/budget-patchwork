
import { DatabaseInitManager } from '../database-init-manager';
import { Dashboard } from '../models/dashboard';
import { BaseDatabaseManager } from '../base-database-manager';
import { IQueryManager } from '../interfaces/IQueryManager';

/**
 * Dashboard manager
 */
export class DashboardManager extends BaseDatabaseManager {
  constructor(queryManager?: IQueryManager) {
    super();
    if (queryManager) {
      this.queryManager = queryManager;
    }
  }

  /**
   * Get all dashboards
   */
  async getDashboards(): Promise<Dashboard[]> {
    const success = await this.ensureInitialized();
    if (!success) return [];
    
    try {
      return this.queryManager.executeGetDashboards();
    } catch (error) {
      console.error("Error getting dashboards:", error);
      return [];
    }
  }

  /**
   * Add a dashboard
   */
  async addDashboard(dashboard: Dashboard): Promise<void> {
    const success = await this.ensureInitialized();
    if (!success) return;
    
    try {
      await this.queryManager.executeAddDashboard(dashboard);
    } catch (error) {
      console.error("Error adding dashboard:", error);
      throw error;
    }
  }

  /**
   * Update a dashboard
   */
  async updateDashboard(dashboard: Dashboard): Promise<void> {
    const success = await this.ensureInitialized();
    if (!success) return;
    
    try {
      await this.queryManager.executeUpdateDashboard(dashboard);
    } catch (error) {
      console.error("Error updating dashboard:", error);
      throw error;
    }
  }

  /**
   * Delete a dashboard
   */
  async deleteDashboard(id: string): Promise<void> {
    const success = await this.ensureInitialized();
    if (!success) return;
    
    try {
      await this.queryManager.executeDeleteDashboard(id);
    } catch (error) {
      console.error("Error deleting dashboard:", error);
      throw error;
    }
  }
  
  /**
   * Set the query manager for this manager
   */
  setQueryManager(queryManager: IQueryManager): this {
    this.queryManager = queryManager;
    return this;
  }
}
