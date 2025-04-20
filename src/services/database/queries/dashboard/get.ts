
import { Dashboard } from '../../models/dashboard';

export const dashboardGetQueries = {
  getAll: (db: any): Dashboard[] => {
    try {
      console.log("Getting all dashboards...");
      const result = db.exec('SELECT * FROM dashboards');
      
      if (!result || result.length === 0 || !result[0]?.values) {
        console.log("No dashboards found");
        return [];
      }
      
      const dashboards = result[0].values.map((row: any[]) => ({
        id: row[0],
        title: row[1],
        createdAt: row[2],
        updatedAt: row[3],
        description: row[4] || null,
        icon: row[5] || null,
        color: row[6] || null
      }));
      
      console.log(`Found ${dashboards.length} dashboards`);
      return dashboards;
    } catch (error) {
      console.error("Error getting dashboards:", error);
      return [];
    }
  },
  
  getById: (db: any, id: string): Dashboard | null => {
    try {
      console.log(`Getting dashboard with id ${id}...`);
      const result = db.exec('SELECT * FROM dashboards WHERE id = ?', [id]);
      
      if (!result || result.length === 0 || !result[0]?.values || result[0].values.length === 0) {
        console.log(`No dashboard found with id ${id}`);
        return null;
      }
      
      const row = result[0].values[0];
      const dashboard: Dashboard = {
        id: row[0],
        title: row[1],
        createdAt: row[2],
        updatedAt: row[3],
        description: row[4] || null,
        icon: row[5] || null,
        color: row[6] || null
      };
      
      console.log(`Found dashboard: ${dashboard.title}`);
      return dashboard;
    } catch (error) {
      console.error(`Error getting dashboard with id ${id}:`, error);
      return null;
    }
  }
};
