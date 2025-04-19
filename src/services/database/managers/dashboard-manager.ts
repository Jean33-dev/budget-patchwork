
import { Dashboard } from '../models/dashboard';
import { BaseDatabaseManager } from '../base-database-manager';
import { IDashboardManager } from '../interfaces/IDashboardManager';
import { IQueryManager } from '../interfaces/IQueryManager';

/**
 * Responsible for handling dashboard-related database operations
 */
export class DashboardManager extends BaseDatabaseManager implements IDashboardManager {
  private currentDashboardId: string | null = null;

  /**
   * Get all dashboards from the database
   */
  async getDashboards(): Promise<Dashboard[]> {
    const success = await this.ensureInitialized();
    if (!success) return [];
    
    try {
      // Temporairement, nous allons utiliser une requête directe car nous n'avons pas encore
      // implémenté un query manager pour les tableaux de bord
      const results = await this.query("SELECT * FROM dashboards");
      return results.map(row => ({
        id: row.id,
        title: row.title,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        description: row.description,
        icon: row.icon,
        color: row.color
      }));
    } catch (error) {
      console.error("Error getting dashboards:", error);
      return [];
    }
  }

  /**
   * Get a dashboard by ID
   */
  async getDashboardById(id: string): Promise<Dashboard | null> {
    const success = await this.ensureInitialized();
    if (!success) return null;
    
    try {
      const results = await this.query("SELECT * FROM dashboards WHERE id = ?", [id]);
      if (results.length === 0) {
        return null;
      }
      
      const row = results[0];
      return {
        id: row.id,
        title: row.title,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        description: row.description,
        icon: row.icon,
        color: row.color
      };
    } catch (error) {
      console.error(`Error getting dashboard with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Add a new dashboard to the database
   */
  async addDashboard(dashboard: Dashboard): Promise<void> {
    const success = await this.ensureInitialized();
    if (!success) return;
    
    try {
      const now = new Date().toISOString();
      await this.run(
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
    } catch (error) {
      console.error("Error adding dashboard:", error);
      throw error;
    }
  }

  /**
   * Update an existing dashboard in the database
   */
  async updateDashboard(dashboard: Dashboard): Promise<void> {
    const success = await this.ensureInitialized();
    if (!success) return;
    
    try {
      const now = new Date().toISOString();
      await this.run(
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
    } catch (error) {
      console.error("Error updating dashboard:", error);
      throw error;
    }
  }

  /**
   * Delete a dashboard from the database
   */
  async deleteDashboard(id: string): Promise<void> {
    const success = await this.ensureInitialized();
    if (!success) return;
    
    try {
      await this.run('DELETE FROM dashboards WHERE id = ?', [id]);
    } catch (error) {
      console.error("Error deleting dashboard:", error);
      throw error;
    }
  }

  /**
   * Get the current dashboard ID
   */
  getCurrentDashboardId(): string | null {
    return this.currentDashboardId;
  }

  /**
   * Set the current dashboard ID
   */
  setCurrentDashboardId(id: string): void {
    this.currentDashboardId = id;
  }
  
  /**
   * Set the query manager for this manager
   */
  setQueryManager(queryManager: IQueryManager): this {
    this.queryManager = queryManager;
    return this;
  }
}
