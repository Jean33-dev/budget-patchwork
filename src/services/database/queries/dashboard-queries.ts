
import { Database } from "sql.js";
import { Dashboard } from '../models/dashboard';

// SQL Schema for dashboard table
export const dashboardTableSchema = `
CREATE TABLE IF NOT EXISTS dashboards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  lastAccessed TEXT NOT NULL
);
`;

// SQL query to get all dashboards
export const getAllDashboardsQuery = `
SELECT * FROM dashboards ORDER BY lastAccessed DESC;
`;

// SQL query to add a dashboard
export const addDashboardQuery = `
INSERT INTO dashboards (id, title, createdAt, lastAccessed)
VALUES (?, ?, ?, ?);
`;

// SQL query to update a dashboard
export const updateDashboardQuery = `
UPDATE dashboards
SET title = ?, lastAccessed = ?
WHERE id = ?;
`;

// SQL query to delete a dashboard
export const deleteDashboardQuery = `
DELETE FROM dashboards
WHERE id = ?;
`;

// Dashboard queries implementation
export const dashboardQueries = {
  getAll: (db: Database): Dashboard[] => {
    try {
      const stmt = db.prepare(getAllDashboardsQuery);
      const rows = stmt.getAsObject([]);
      stmt.free();

      if (Array.isArray(rows)) {
        return rows.map(row => ({
          id: row.id as string,
          title: row.title as string,
          createdAt: row.createdAt as string,
          lastAccessed: row.lastAccessed as string
        }));
      } else {
        console.error("Unexpected result format from database query:", rows);
        return [];
      }
    } catch (error) {
      console.error("Error getting dashboards:", error);
      return [];
    }
  },

  add: (db: Database, dashboard: Dashboard): void => {
    try {
      const stmt = db.prepare(addDashboardQuery);
      stmt.run([dashboard.id, dashboard.title, dashboard.createdAt, dashboard.lastAccessed]);
      stmt.free();
    } catch (error) {
      console.error("Error adding dashboard:", error);
      throw error;
    }
  },

  update: (db: Database, dashboard: Dashboard): void => {
    try {
      const stmt = db.prepare(updateDashboardQuery);
      stmt.run([dashboard.title, dashboard.lastAccessed, dashboard.id]);
      stmt.free();
    } catch (error) {
      console.error("Error updating dashboard:", error);
      throw error;
    }
  },

  delete: (db: Database, id: string): void => {
    try {
      const stmt = db.prepare(deleteDashboardQuery);
      stmt.run([id]);
      stmt.free();
    } catch (error) {
      console.error("Error deleting dashboard:", error);
      throw error;
    }
  }
};
