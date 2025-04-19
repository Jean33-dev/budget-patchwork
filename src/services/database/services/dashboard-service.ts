
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
      const results = await adapter!.query("SELECT * FROM dashboards");
      
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
      const results = await adapter!.query("SELECT * FROM dashboards WHERE id = ?", [id]);
      
      if (results.length === 0) {
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
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    const now = new Date().toISOString();
    
    await adapter!.run(
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
  }

  /**
   * Updates an existing dashboard
   */
  async updateDashboard(dashboard: Dashboard): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    const now = new Date().toISOString();
    
    await adapter!.run(
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
  }

  /**
   * Deletes a dashboard
   */
  async deleteDashboard(id: string): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run('DELETE FROM dashboards WHERE id = ?', [id]);
  }
}
