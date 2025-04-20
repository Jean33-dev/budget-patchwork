
export const dashboardTableQueries = {
  createTable: `
    CREATE TABLE IF NOT EXISTS dashboards (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      color TEXT
    )
  `
};
