
import { Dashboard } from '../models/dashboard';

export const dashboardQueries = {
  getAll: (db: any): Promise<Dashboard[]> => {
    return new Promise((resolve, reject) => {
      try {
        // Vérifier si la table existe
        db.exec(`CREATE TABLE IF NOT EXISTS dashboards (
          id TEXT PRIMARY KEY,
          title TEXT,
          createdAt TEXT,
          lastAccessed TEXT
        )`);
        
        const stmt = db.prepare(`SELECT * FROM dashboards ORDER BY lastAccessed DESC`);
        const results: Dashboard[] = [];
        
        while (stmt.step()) {
          const row = stmt.getAsObject();
          results.push({
            id: row.id,
            title: row.title,
            createdAt: row.createdAt,
            lastAccessed: row.lastAccessed
          });
        }
        
        stmt.free();
        resolve(results);
      } catch (error) {
        console.error("Error in dashboard-queries.getAll:", error);
        reject(error);
      }
    });
  },

  add: (db: any, dashboard: Dashboard): void => {
    try {
      // Vérifier si la table existe
      db.exec(`CREATE TABLE IF NOT EXISTS dashboards (
        id TEXT PRIMARY KEY,
        title TEXT,
        createdAt TEXT,
        lastAccessed TEXT
      )`);
      
      const stmt = db.prepare(`
        INSERT INTO dashboards (id, title, createdAt, lastAccessed)
        VALUES (?, ?, ?, ?)
      `);
      
      stmt.run([dashboard.id, dashboard.title, dashboard.createdAt, dashboard.lastAccessed]);
      stmt.free();
    } catch (error) {
      console.error("Error in dashboard-queries.add:", error);
      throw error;
    }
  },

  update: (db: any, dashboard: Dashboard): void => {
    try {
      const stmt = db.prepare(`
        UPDATE dashboards 
        SET title = ?, lastAccessed = ?
        WHERE id = ?
      `);
      
      stmt.run([dashboard.title, dashboard.lastAccessed, dashboard.id]);
      stmt.free();
    } catch (error) {
      console.error("Error in dashboard-queries.update:", error);
      throw error;
    }
  },

  delete: (db: any, id: string): void => {
    try {
      const stmt = db.prepare(`DELETE FROM dashboards WHERE id = ?`);
      stmt.run([id]);
      stmt.free();
    } catch (error) {
      console.error("Error in dashboard-queries.delete:", error);
      throw error;
    }
  }
};
