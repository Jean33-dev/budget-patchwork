
import { Dashboard } from '../models/dashboard';
import { BaseService } from './base-service';

/**
 * Service for handling dashboard-related database operations
 */
export class DashboardService extends BaseService {
  /**
   * Retrieves all dashboards
   */
  async getDashboards(): Promise<Dashboard[]> {
    try {
      if (!await this.ensureInitialized()) return [];
      
      const adapter = this.initManager.getAdapter();
      if (!adapter) {
        console.error("Database adapter is not initialized");
        return [];
      }
      
      console.log("DashboardService: Retrieving all dashboards...");
      const results = await adapter.query("SELECT * FROM dashboards");
      console.log("DashboardService: Found dashboards:", results);
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        description: row.description || '',
        icon: row.icon || '',
        color: row.color || ''
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des tableaux de bord:", error);
      return [];
    }
  }

  /**
   * Retrieves a dashboard by ID
   */
  async getDashboardById(id: string): Promise<Dashboard | null> {
    try {
      if (!await this.ensureInitialized()) return null;
      
      const adapter = this.initManager.getAdapter();
      if (!adapter) {
        console.error("Database adapter is not initialized");
        return null;
      }
      
      console.log(`DashboardService: Retrieving dashboard with ID ${id}...`);
      const results = await adapter.query("SELECT * FROM dashboards WHERE id = ?", [id]);
      
      if (results.length === 0) {
        console.log(`DashboardService: No dashboard found with ID ${id}`);
        return null;
      }
      
      const row = results[0];
      return {
        id: row.id,
        title: row.title,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        description: row.description || '',
        icon: row.icon || '',
        color: row.color || ''
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération du tableau de bord avec l'ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Adds a new dashboard
   */
  async addDashboard(dashboard: Dashboard): Promise<void> {
    try {
      if (!await this.ensureInitialized()) return;
      
      const adapter = this.initManager.getAdapter();
      if (!adapter) {
        console.error("Database adapter is not initialized");
        return;
      }
      
      const now = new Date().toISOString();
      console.log(`DashboardService: Adding new dashboard "${dashboard.title}"...`);
      
      await adapter.run(
        'INSERT INTO dashboards (id, title, createdAt, updatedAt, description, icon, color) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          dashboard.id, 
          dashboard.title, 
          dashboard.createdAt || now, 
          dashboard.updatedAt || now, 
          dashboard.description || '',
          dashboard.icon || '',
          dashboard.color || ''
        ]
      );
      
      console.log(`DashboardService: Dashboard "${dashboard.title}" added successfully`);
    } catch (error) {
      console.error("Erreur lors de l'ajout du tableau de bord:", error);
      throw error;
    }
  }

  /**
   * Updates an existing dashboard
   */
  async updateDashboard(dashboard: Dashboard): Promise<void> {
    try {
      if (!await this.ensureInitialized()) return;
      
      const adapter = this.initManager.getAdapter();
      if (!adapter) {
        console.error("Database adapter is not initialized");
        return;
      }
      
      const now = new Date().toISOString();
      console.log(`DashboardService: Updating dashboard with ID ${dashboard.id}...`);
      
      await adapter.run(
        'UPDATE dashboards SET title = ?, updatedAt = ?, description = ?, icon = ?, color = ? WHERE id = ?',
        [
          dashboard.title, 
          now, 
          dashboard.description || '',
          dashboard.icon || '',
          dashboard.color || '',
          dashboard.id
        ]
      );
      
      console.log(`DashboardService: Dashboard with ID ${dashboard.id} updated successfully`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du tableau de bord:", error);
      throw error;
    }
  }

  /**
   * Deletes a dashboard
   */
  async deleteDashboard(id: string): Promise<void> {
    try {
      if (!await this.ensureInitialized()) return;
      
      const adapter = this.initManager.getAdapter();
      if (!adapter) {
        console.error("Database adapter is not initialized");
        return;
      }
      
      console.log(`DashboardService: Deleting dashboard with ID ${id}...`);
      await adapter.run('DELETE FROM dashboards WHERE id = ?', [id]);
      console.log(`DashboardService: Dashboard with ID ${id} deleted successfully`);
    } catch (error) {
      console.error("Erreur lors de la suppression du tableau de bord:", error);
      throw error;
    }
  }
}
