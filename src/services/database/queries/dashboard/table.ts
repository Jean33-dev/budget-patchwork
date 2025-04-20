
export const dashboardTableQueries = {
  create: (db: any): void => {
    if (!db) {
      console.error("Database is null in dashboardQueries.create");
      return;
    }
    
    try {
      console.log("Creating dashboards table...");
      db.exec(`
        CREATE TABLE IF NOT EXISTS dashboards (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          description TEXT,
          icon TEXT,
          color TEXT
        )
      `);
      console.log("Dashboards table created successfully");
    } catch (error) {
      console.error("Error creating dashboards table:", error);
    }
  }
};
