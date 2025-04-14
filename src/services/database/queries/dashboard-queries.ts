
import { Database } from 'sql.js';
import { Dashboard } from '../models/dashboard';

export const dashboardQueries = {
  /**
   * Get all dashboards
   * @param db Database
   * @returns Dashboards
   */
  getAll: (db: Database): Dashboard[] => {
    try {
      const result = db.exec('SELECT id, title, createdAt, lastAccessed FROM dashboards');
      
      if (result.length === 0 || result[0].values.length === 0) {
        return [];
      }
      
      const columns = result[0].columns;
      return result[0].values.map(row => {
        const dashboard: any = {};
        columns.forEach((column, index) => {
          dashboard[column] = row[index];
        });
        return dashboard as Dashboard;
      });
    } catch (error) {
      console.error('Error getting dashboards:', error);
      return [];
    }
  },

  /**
   * Add a dashboard
   * @param db Database
   * @param dashboard Dashboard
   */
  add: (db: Database, dashboard: Dashboard): void => {
    try {
      const stmt = db.prepare(
        'INSERT INTO dashboards (id, title, createdAt, lastAccessed) VALUES (?, ?, ?, ?)'
      );
      stmt.run([dashboard.id, dashboard.title, dashboard.createdAt, dashboard.lastAccessed]);
      stmt.free();
    } catch (error) {
      console.error('Error adding dashboard:', error);
      throw error;
    }
  },

  /**
   * Update a dashboard
   * @param db Database
   * @param dashboard Dashboard
   */
  update: (db: Database, dashboard: Dashboard): void => {
    try {
      const stmt = db.prepare(
        'UPDATE dashboards SET title = ?, lastAccessed = ? WHERE id = ?'
      );
      stmt.run([dashboard.title, dashboard.lastAccessed, dashboard.id]);
      stmt.free();
    } catch (error) {
      console.error('Error updating dashboard:', error);
      throw error;
    }
  },

  /**
   * Delete a dashboard
   * @param db Database
   * @param id Dashboard ID
   */
  delete: (db: Database, id: string): void => {
    try {
      const stmt = db.prepare('DELETE FROM dashboards WHERE id = ?');
      stmt.run([id]);
      stmt.free();
    } catch (error) {
      console.error('Error deleting dashboard:', error);
      throw error;
    }
  }
};
