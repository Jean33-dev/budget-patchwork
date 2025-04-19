
import { Dashboard } from '../../models/dashboard';

export const dashboardMutationQueries = {
  add: (db: any, dashboard: Dashboard): void => {
    if (!db) {
      console.error("Database is null in dashboardQueries.add");
      return;
    }
    
    try {
      const stmt = db.prepare(
        'INSERT INTO dashboards (id, title, createdAt, updatedAt) VALUES (?, ?, ?, ?)'
      );
      
      stmt.run([
        String(dashboard.id),
        String(dashboard.title),
        String(dashboard.createdAt),
        String(dashboard.updatedAt)
      ]);
      
      stmt.free();
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un tableau de bord:", error);
    }
  },

  update: (db: any, dashboard: Dashboard): void => {
    if (!db) {
      console.error("Database is null in dashboardQueries.update");
      return;
    }
    
    try {
      const stmt = db.prepare(
        'UPDATE dashboards SET title = ?, updatedAt = ? WHERE id = ?'
      );
      
      stmt.run([
        String(dashboard.title),
        String(new Date().toISOString()),
        String(dashboard.id)
      ]);
      
      stmt.free();
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'un tableau de bord:", error);
    }
  }
};
