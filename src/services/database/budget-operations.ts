
import { Budget } from '@/types/database-types';

export class BudgetOperations {
  constructor(private db: any) {}

  async getBudgets(): Promise<Budget[]> {
    const result = this.db.exec('SELECT * FROM budgets');
    return result[0]?.values?.map((row: any[]) => ({
      id: String(row[0]),
      title: String(row[1]),
      budget: Number(row[2]),
      spent: Number(row[3]),
      type: row[4] as 'budget'
    })) || [];
  }

  async addBudget(budget: Budget) {
    try {
      this.db.run(
        'INSERT INTO budgets (id, title, budget, spent, type) VALUES (?, ?, ?, ?, ?)',
        [
          String(budget.id),
          String(budget.title),
          Number(budget.budget),
          Number(budget.spent),
          String(budget.type)
        ]
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout du budget:", error);
      throw error;
    }
  }

  async updateBudget(budget: Budget) {
    this.db.run(
      'UPDATE budgets SET title = ?, budget = ?, spent = ? WHERE id = ?',
      [
        String(budget.title),
        Number(budget.budget),
        Number(budget.spent),
        String(budget.id)
      ]
    );
  }

  async deleteBudget(id: string) {
    this.db.run('DELETE FROM budgets WHERE id = ?', [String(id)]);
  }
}
