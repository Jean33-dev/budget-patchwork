
import { Dashboard } from '../models/dashboard';
import { DatabaseManagerFactory } from '../database-manager-factory';

export class DashboardOperationsManager {
  private ensureInitialized: () => Promise<boolean>;
  private managerFactory: DatabaseManagerFactory;

  constructor(
    ensureInitializedFn: () => Promise<boolean>,
    managerFactory: DatabaseManagerFactory
  ) {
    this.ensureInitialized = ensureInitializedFn;
    this.managerFactory = managerFactory;
  }

  async getDashboards(): Promise<Dashboard[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized for getDashboards operation");
        return [];
      }

      console.log("DashboardOperationsManager: Getting dashboards...");
      const dashboardManager = this.managerFactory.getDashboardManager();
      const dashboards = await dashboardManager.getDashboards();
      console.log("DashboardOperationsManager: Found dashboards:", dashboards);
      return dashboards;
    } catch (error) {
      console.error("Error getting dashboards:", error);
      return [];
    }
  }

  async getDashboardById(id: string): Promise<Dashboard | null> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized for getDashboardById operation");
        return null;
      }

      console.log(`DashboardOperationsManager: Getting dashboard with ID ${id}...`);
      const dashboardManager = this.managerFactory.getDashboardManager();
      const dashboard = await dashboardManager.getDashboardById(id);
      console.log(`DashboardOperationsManager: ${dashboard ? 'Found' : 'Did not find'} dashboard with ID ${id}`);
      return dashboard;
    } catch (error) {
      console.error(`Error getting dashboard with ID ${id}:`, error);
      return null;
    }
  }

  async addDashboard(dashboard: Dashboard): Promise<void> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized for addDashboard operation");
        return;
      }

      console.log(`DashboardOperationsManager: Adding new dashboard "${dashboard.title}"...`);
      const dashboardManager = this.managerFactory.getDashboardManager();
      await dashboardManager.addDashboard(dashboard);
      console.log(`DashboardOperationsManager: Dashboard "${dashboard.title}" added successfully`);
    } catch (error) {
      console.error("Error adding dashboard:", error);
      throw error;
    }
  }

  async updateDashboard(dashboard: Dashboard): Promise<void> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized for updateDashboard operation");
        return;
      }

      console.log(`DashboardOperationsManager: Updating dashboard with ID ${dashboard.id}...`);
      const dashboardManager = this.managerFactory.getDashboardManager();
      await dashboardManager.updateDashboard(dashboard);
      console.log(`DashboardOperationsManager: Dashboard with ID ${dashboard.id} updated successfully`);
    } catch (error) {
      console.error("Error updating dashboard:", error);
      throw error;
    }
  }

  async deleteDashboard(id: string): Promise<void> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized for deleteDashboard operation");
        return;
      }

      console.log(`DashboardOperationsManager: Deleting dashboard with ID ${id}...`);
      const dashboardManager = this.managerFactory.getDashboardManager();
      await dashboardManager.deleteDashboard(id);
      console.log(`DashboardOperationsManager: Dashboard with ID ${id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting dashboard:", error);
      throw error;
    }
  }
}
