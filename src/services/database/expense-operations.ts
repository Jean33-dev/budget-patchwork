
import { Expense } from '@/types/database-types';

export class ExpenseOperations {
  constructor(private db: any) {}

  async getExpenses(): Promise<Expense[]> {
    const result = this.db.exec('SELECT * FROM expenses');
    return result[0]?.values?.map((row: any[]) => ({
      id: String(row[0]),
      title: String(row[1]),
      budget: Number(row[2]),
      spent: Number(row[3]),
      type: row[4] as 'expense',
      linkedBudgetId: row[5] ? String(row[5]) : undefined,
      date: String(row[6])
    })) || [];
  }

  async addExpense(expense: Expense) {
    this.db.run(
      'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        expense.id,
        expense.title,
        Number(expense.budget),
        Number(expense.spent),
        expense.type,
        expense.linkedBudgetId || null,
        expense.date
      ]
    );
  }

  async updateExpense(expense: Expense) {
    this.db.run(
      'UPDATE expenses SET title = ?, budget = ?, spent = ?, linkedBudgetId = ?, date = ? WHERE id = ?',
      [
        expense.title,
        Number(expense.budget),
        Number(expense.spent),
        expense.linkedBudgetId || null,
        expense.date,
        expense.id
      ]
    );
  }

  async deleteExpense(id: string) {
    this.db.run('DELETE FROM expenses WHERE id = ?', [id]);
  }
}
