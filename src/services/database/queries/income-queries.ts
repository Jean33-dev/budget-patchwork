
import { Income } from '../models/income';

export const incomeQueries = {
  createTable: `
    CREATE TABLE IF NOT EXISTS incomes (
      id TEXT PRIMARY KEY,
      title TEXT,
      budget REAL DEFAULT 0,
      spent REAL DEFAULT 0,
      type TEXT,
      date TEXT,
      isFixed INTEGER DEFAULT 0
    )
  `,
  
  getAll: (db: any): Income[] => {
    const result = db.exec('SELECT * FROM incomes');
    return result[0]?.values?.map((row: any[]) => ({
      id: row[0],
      title: row[1],
      budget: row[2],
      spent: row[3],
      type: row[4] as 'income',
      date: row[5],
      isFixed: Boolean(row[6] || false)
    })) || [];
  },
  
  add: (db: any, income: Income): void => {
    db.run(
      'INSERT INTO incomes (id, title, budget, spent, type, date, isFixed) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [income.id, income.title, income.budget, income.spent, income.type, income.date, income.isFixed ? 1 : 0]
    );
  },
  
  update: (db: any, income: Income): void => {
    db.run(
      'UPDATE incomes SET title = ?, budget = ?, spent = ?, date = ?, isFixed = ? WHERE id = ?',
      [income.title, income.budget, income.spent, income.date, income.isFixed ? 1 : 0, income.id]
    );
  },
  
  delete: (db: any, id: string): void => {
    db.run('DELETE FROM incomes WHERE id = ?', [id]);
  }
};
