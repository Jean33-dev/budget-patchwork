
import { Dashboard } from '../models/dashboard';
import { BaseService } from './base-service';
import { toast } from "@/components/ui/use-toast";

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
      // Vérifier si la table existe et la créer si nécessaire
      await adapter!.run(`CREATE TABLE IF NOT EXISTS dashboards (
        id TEXT PRIMARY KEY,
        title TEXT,
        createdAt TEXT,
        lastAccessed TEXT
      )`);
      
      const results = await adapter!.query("SELECT * FROM dashboards");
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        createdAt: row.createdAt,
        lastAccessed: row.lastAccessed
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des tableaux de bord:", error);
      return [];
    }
  }

  /**
   * Adds a new dashboard
   */
  async addDashboard(dashboard: Dashboard): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    // Vérifier si la table existe et la créer si nécessaire
    await adapter!.run(`CREATE TABLE IF NOT EXISTS dashboards (
      id TEXT PRIMARY KEY,
      title TEXT,
      createdAt TEXT,
      lastAccessed TEXT
    )`);
    
    await adapter!.run(
      'INSERT INTO dashboards (id, title, createdAt, lastAccessed) VALUES (?, ?, ?, ?)',
      [dashboard.id, dashboard.title, dashboard.createdAt, dashboard.lastAccessed]
    );
  }

  /**
   * Updates an existing dashboard
   */
  async updateDashboard(dashboard: Dashboard): Promise<void> {
    if (!await this.ensureInitialized()) return;
    
    const adapter = this.initManager.getAdapter();
    await adapter!.run(
      'UPDATE dashboards SET title = ?, lastAccessed = ? WHERE id = ?',
      [dashboard.title, dashboard.lastAccessed, dashboard.id]
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
