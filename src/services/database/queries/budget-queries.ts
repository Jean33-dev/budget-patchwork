
import { Budget } from '../models/budget';

export const budgetQueries = {
  createTable: `
    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      title TEXT,
      budget REAL DEFAULT 0,
      spent REAL DEFAULT 0,
      type TEXT,
      carriedOver REAL DEFAULT 0
    )
  `,
  
  sampleData: (currentDate: string) => `
    INSERT OR IGNORE INTO budgets (id, title, budget, spent, type, carriedOver)
    VALUES 
    ('bud_1', 'Courses', 500.00, 600.00, 'budget', 0),
    ('bud_2', 'Transport', 200.00, 0.00, 'budget', 0),
    ('bud_3', 'Loisirs', 150.00, 0.00, 'budget', 0),
    ('bud_4', 'Restaurant', 300.00, 150.00, 'budget', 0),
    ('bud_5', 'Shopping', 250.00, 100.00, 'budget', 0)
  `,
  
  expenseSampleData: (currentDate: string) => `
    INSERT OR IGNORE INTO expenses (id, title, budget, spent, type, linkedBudgetId, date)
    VALUES 
    ('exp_1', 'Courses Carrefour', 350.00, 0, 'expense', 'bud_1', ?),
    ('exp_2', 'Courses Lidl', 250.00, 0, 'expense', 'bud_1', ?),
    ('exp_3', 'Restaurant italien', 150.00, 0, 'expense', 'bud_4', ?),
    ('exp_4', 'Vêtements', 100.00, 0, 'expense', 'bud_5', ?)
  `,
  
  getAll: (db: any): Budget[] => {
    const result = db.exec('SELECT * FROM budgets');
    return result[0]?.values?.map((row: any[]) => ({
      id: row[0],
      title: row[1],
      budget: row[2],
      spent: row[3],
      type: row[4] as 'budget',
      carriedOver: row[5] || 0
    })) || [];
  },
  
  add: (db: any, budget: Budget): void => {
    db.run(
      'INSERT INTO budgets (id, title, budget, spent, type, carriedOver) VALUES (?, ?, ?, ?, ?, ?)',
      [budget.id, budget.title, budget.budget, budget.spent, budget.type, budget.carriedOver || 0]
    );
  },
  
  update: (db: any, budget: Budget): void => {
    db.run(
      'UPDATE budgets SET title = ?, budget = ?, spent = ?, carriedOver = ? WHERE id = ?',
      [budget.title, budget.budget, budget.spent, budget.carriedOver || 0, budget.id]
    );
  },
  
  delete: (db: any, id: string): void => {
    db.run('DELETE FROM budgets WHERE id = ?', [id]);
  }
};
