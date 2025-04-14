
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
