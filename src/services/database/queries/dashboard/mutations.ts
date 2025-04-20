
import { Dashboard } from "../../models/dashboard";

export const dashboardMutationQueries = {
  add: (db: any, dashboard: Dashboard): void => {
    if (!db) {
      console.error("Database is null in dashboardQueries.add");
      return;
    }
    
    try {
      console.log("Adding dashboard:", dashboard);
      
      const stmt = db.prepare(`
        INSERT INTO dashboards (id, title, createdAt, updatedAt, description, icon, color)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        dashboard.id,
        dashboard.title,
        dashboard.createdAt,
        dashboard.updatedAt,
        dashboard.description || null,
        dashboard.icon || null,
        dashboard.color || null
      ]);
      
      stmt.free();
      console.log("Dashboard added successfully:", dashboard.title);
    } catch (error) {
      console.error("Error adding dashboard:", error);
    }
  },
  
  update: (db: any, dashboard: Dashboard): void => {
    if (!db) {
      console.error("Database is null in dashboardQueries.update");
      return;
    }
    
    try {
      console.log("Updating dashboard:", dashboard);
      
      const stmt = db.prepare(`
        UPDATE dashboards 
        SET title = ?, updatedAt = ?, description = ?, icon = ?, color = ?
        WHERE id = ?
      `);
      
      stmt.run([
        dashboard.title,
        dashboard.updatedAt,
        dashboard.description || null,
        dashboard.icon || null,
        dashboard.color || null,
        dashboard.id
      ]);
      
      stmt.free();
      console.log("Dashboard updated successfully:", dashboard.title);
    } catch (error) {
      console.error("Error updating dashboard:", error);
    }
  },
  
  delete: (db: any, id: string): void => {
    if (!db) {
      console.error("Database is null in dashboardQueries.delete");
      return;
    }
    
    try {
      console.log("Deleting dashboard with ID:", id);
      
      const stmt = db.prepare("DELETE FROM dashboards WHERE id = ?");
      stmt.run([id]);
      stmt.free();
      
      console.log("Dashboard deleted successfully");
    } catch (error) {
      console.error("Error deleting dashboard:", error);
    }
  }
};
