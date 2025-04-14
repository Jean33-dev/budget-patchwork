
import { Database } from 'sql.js';

export class DatabaseInitManager {
  async initializeDatabase(db: Database): Promise<void> {
    // Create tables if they don't exist
    this.createBudgetsTable(db);
    this.createCategoriesTable(db);
    this.createExpensesTable(db);
    this.createIncomesTable(db);
    this.createDashboardsTable(db);
  }

  private createBudgetsTable(db: Database): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        budget REAL NOT NULL,
        spent REAL NOT NULL,
        type TEXT NOT NULL,
        categoryId TEXT,
        createdAt TEXT NOT NULL,
        dashboardId TEXT
      )
    `);
  }

  private createCategoriesTable(db: Database): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT,
        dashboardId TEXT
      )
    `);
  }

  private createExpensesTable(db: Database): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        categoryId TEXT,
        budgetId TEXT,
        recurring INTEGER DEFAULT 0,
        frequency TEXT,
        notes TEXT,
        dashboardId TEXT
      )
    `);
  }

  private createIncomesTable(db: Database): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS incomes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        recurring INTEGER DEFAULT 0,
        frequency TEXT,
        notes TEXT,
        dashboardId TEXT
      )
    `);
  }

  private createDashboardsTable(db: Database): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS dashboards (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        lastAccessed TEXT NOT NULL
      )
    `);
  }
}
