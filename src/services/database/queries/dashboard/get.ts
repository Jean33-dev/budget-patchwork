
import { Dashboard } from '../../models/dashboard';

export const dashboardGetQueries = {
  getAll: (db: any): Dashboard[] => {
    try {
      if (!db) {
        console.error("Database is null in dashboardQueries.getAll");
        return [];
      }
      
      const result = db.exec('SELECT * FROM dashboards');
      if (!result || result.length === 0 || !result[0]?.values) {
        return [];
      }
      
      return result[0].values.map((row: any[]) => ({
        id: String(row[0]),
        title: String(row[1]),
        createdAt: String(row[2]),
        updatedAt: String(row[3])
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des tableaux de bord:", error);
      return [];
    }
  },

  getById: (db: any, id: string): Dashboard | null => {
    try {
      if (!db) {
        console.error("Database is null in dashboardQueries.getById");
        return null;
      }
      
      const result = db.exec('SELECT * FROM dashboards WHERE id = ?', [id]);
      if (!result || result.length === 0 || !result[0]?.values?.length === 0) {
        return null;
      }
      
      const row = result[0].values[0];
      return {
        id: String(row[0]),
        title: String(row[1]),
        createdAt: String(row[2]),
        updatedAt: String(row[3])
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération du tableau de bord ${id}:`, error);
      return null;
    }
  }
};
