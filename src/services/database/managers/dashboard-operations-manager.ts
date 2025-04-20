
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
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      console.error("Database not initialized for getDashboards operation");
      return [];
    }

    const dashboardManager = this.managerFactory.getDashboardManager();
    return dashboardManager.getDashboards();
  }

  async getDashboardById(id: string): Promise<Dashboard | null> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      console.error("Database not initialized for getDashboardById operation");
      return null;
    }

    const dashboardManager = this.managerFactory.getDashboardManager();
    return dashboardManager.getDashboardById(id);
  }

  async addDashboard(dashboard: Dashboard): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      console.error("Database not initialized for addDashboard operation");
      return;
    }

    const dashboardManager = this.managerFactory.getDashboardManager();
    await dashboardManager.addDashboard(dashboard);
  }

  async updateDashboard(dashboard: Dashboard): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      console.error("Database not initialized for updateDashboard operation");
      return;
    }

    const dashboardManager = this.managerFactory.getDashboardManager();
    await dashboardManager.updateDashboard(dashboard);
  }

  async deleteDashboard(id: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      console.error("Database not initialized for deleteDashboard operation");
      return;
    }

    const dashboardManager = this.managerFactory.getDashboardManager();
    await dashboardManager.deleteDashboard(id);
  }
}
