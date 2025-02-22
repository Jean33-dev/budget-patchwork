
export const SCHEMA_DEFINITIONS = {
  incomes: `
    CREATE TABLE IF NOT EXISTS incomes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      budget REAL NOT NULL DEFAULT 0,
      spent REAL NOT NULL DEFAULT 0,
      type TEXT NOT NULL DEFAULT 'income'
    )
  `,
  
  expenses: `
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      budget REAL NOT NULL DEFAULT 0,
      spent REAL NOT NULL DEFAULT 0,
      type TEXT NOT NULL DEFAULT 'expense',
      linkedBudgetId TEXT,
      date TEXT NOT NULL
    )
  `,
  
  budgets: `
    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      budget REAL NOT NULL DEFAULT 0,
      spent REAL NOT NULL DEFAULT 0,
      type TEXT NOT NULL DEFAULT 'budget'
    )
  `,
  
  categories: `
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      budgets TEXT NOT NULL DEFAULT '[]',
      total REAL NOT NULL DEFAULT 0,
      spent REAL NOT NULL DEFAULT 0,
      description TEXT
    )
  `
};
