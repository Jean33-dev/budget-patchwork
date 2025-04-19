
import { QueryManager } from '../query-manager';
import { Dashboard } from '../models/dashboard';
import { BaseQueryManager } from './base-query-manager';

export class DashboardQueryManager extends BaseQueryManager {
  constructor(parent: QueryManager) {
    super(parent);
  }

  async getAll(): Promise<Dashboard[]> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return [];
      
      const db = this.getDb();
      const results = await this.query("SELECT * FROM dashboards");
      
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
      console.error("Error getting dashboards:", error);
      return [];
    }
  }

  async getById(id: string): Promise<Dashboard | null> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return null;
      
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
        description: row.description || '',
        icon: row.icon || '',
        color: row.color || ''
      };
    } catch (error) {
      console.error(`Error getting dashboard with ID ${id}:`, error);
      return null;
    }
  }

  async add(dashboard: Dashboard): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      
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

  async update(dashboard: Dashboard): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      
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

  async delete(id: string): Promise<void> {
    try {
      const success = await this.ensureParentInitialized();
      if (!success) return;
      
      await this.run('DELETE FROM dashboards WHERE id = ?', [id]);
    } catch (error) {
      console.error("Error deleting dashboard:", error);
      throw error;
    }
  }
}
