
import { toast } from "@/components/ui/use-toast";
import { Dashboard } from '../models/dashboard';
import { DatabaseManagerFactory } from '../database-manager-factory';

export class DashboardOperationsManager {
  private ensureInitialized: () => Promise<boolean>;
  private managerFactory: DatabaseManagerFactory;

  constructor(
    ensureInitialized: () => Promise<boolean>,
    managerFactory: DatabaseManagerFactory
  ) {
    this.ensureInitialized = ensureInitialized;
    this.managerFactory = managerFactory;
  }

  async getDashboards(): Promise<Dashboard[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getDashboards");
        return [];
      }
      return this.managerFactory.getDashboardManager().getDashboards();
    } catch (error) {
      console.error("Error in getDashboards:", error);
      return [];
    }
  }

  async getDashboardById(id: string): Promise<Dashboard | null> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      console.error("Database not initialized in getDashboardById");
      return null;
    }
    return this.managerFactory.getDashboardManager().getDashboardById(id);
  }

  async addDashboard(dashboard: Dashboard): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addDashboard");
    }
    await this.managerFactory.getDashboardManager().addDashboard(dashboard);
  }

  async updateDashboard(dashboard: Dashboard): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateDashboard");
    }
    await this.managerFactory.getDashboardManager().updateDashboard(dashboard);
  }

  async deleteDashboard(id: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteDashboard");
    }
    await this.managerFactory.getDashboardManager().deleteDashboard(id);
  }
}
