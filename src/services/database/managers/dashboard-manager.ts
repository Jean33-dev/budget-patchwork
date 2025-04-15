
import { DatabaseInitManager } from '../database-init-manager';
import { Dashboard } from '../models/dashboard';
import { BaseDatabaseManager } from '../base-database-manager';
import { IQueryManager } from '../interfaces/IQueryManager';

/**
 * Dashboard manager
 */
export class DashboardManager extends BaseDatabaseManager {
  constructor() {
    super();
  }

  /**
   * Get all dashboards
   */
  async getDashboards(): Promise<Dashboard[]> {
    const success = await this.ensureInitialized();
    if (!success) return [];
    
    try {
      if (!this.queryManager) {
        console.error("Query manager is not initialized in DashboardManager.getDashboards()");
        return [];
      }
      return this.queryManager.executeGetDashboards();
    } catch (error) {
      console.error("Error getting dashboards:", error);
      return [];
    }
  }

  /**
   * Safely add a dashboard (doesn't throw exceptions)
   */
  async safeAddDashboard(dashboard: Dashboard): Promise<boolean> {
    const success = await this.ensureInitialized();
    if (!success) return false;
    
    try {
      if (!this.queryManager) {
        console.error("Query manager is not initialized in DashboardManager.safeAddDashboard()");
        return false;
      }
      
      // First check if dashboard already exists
      const dashboards = await this.getDashboards();
      const exists = dashboards.some(d => d.id === dashboard.id);
      
      if (exists) {
        console.log(`Dashboard ${dashboard.id} already exists, skipping add operation`);
        return true;
      }
      
      await this.queryManager.executeAddDashboard(dashboard);
      return true;
    } catch (error) {
      console.error("Error safely adding dashboard:", error);
      return false;
    }
  }

  /**
   * Add a dashboard
   */
  async addDashboard(dashboard: Dashboard): Promise<void> {
    const success = await this.ensureInitialized();
    if (!success) return;
    
    try {
      if (!this.queryManager) {
        console.error("Query manager is not initialized in DashboardManager.addDashboard()");
        return;
      }
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
      if (!this.queryManager) {
        console.error("Query manager is not initialized in DashboardManager.updateDashboard()");
        return;
      }
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
      if (!this.queryManager) {
        console.error("Query manager is not initialized in DashboardManager.deleteDashboard()");
        return;
      }
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
