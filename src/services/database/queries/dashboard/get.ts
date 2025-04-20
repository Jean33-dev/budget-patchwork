
export const dashboardGetQueries = {
  getAll: (db: any): any[] => {
    if (!db) {
      console.error("Database is null in dashboardQueries.getAll");
      return [];
    }
    
    try {
      console.log("Getting all dashboards...");
      
      // First check if the table exists
      const tableExists = db.exec(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='dashboards'
      `);
      
      if (!tableExists || tableExists.length === 0) {
        console.log("Dashboards table doesn't exist yet");
        return [];
      }
      
      const stmt = db.prepare("SELECT * FROM dashboards");
      const dashboards = [];
      
      while (stmt.step()) {
        const row = stmt.getAsObject();
        dashboards.push(row);
      }
      
      stmt.free();
      console.log(`Found ${dashboards.length} dashboards`);
      return dashboards;
    } catch (error) {
      console.error("Error getting dashboards:", error);
      return [];
    }
  },
  
  getById: (db: any, id: string): any | null => {
    if (!db) {
      console.error("Database is null in dashboardQueries.getById");
      return null;
    }
    
    try {
      console.log(`Getting dashboard with ID ${id}...`);
      
      // First check if the table exists
      const tableExists = db.exec(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='dashboards'
      `);
      
      if (!tableExists || tableExists.length === 0) {
        console.log("Dashboards table doesn't exist yet");
        return null;
      }
      
      const stmt = db.prepare("SELECT * FROM dashboards WHERE id = ?");
      stmt.bind([id]);
      
      const result = stmt.step() ? stmt.getAsObject() : null;
      stmt.free();
      
      return result;
    } catch (error) {
      console.error(`Error getting dashboard with ID ${id}:`, error);
      return null;
    }
  }
};
