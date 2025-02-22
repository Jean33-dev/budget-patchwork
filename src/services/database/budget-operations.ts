
import { Budget } from '@/types/database-types';

export class BudgetOperations {
  constructor(private db: any) {}

  private async executeWithDelay<T>(operation: () => T): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = operation();
        resolve(result);
      }, 0);
    });
  }

  async getBudgets(): Promise<Budget[]> {
    try {
      return await this.executeWithDelay(() => {
        const result = this.db.exec('SELECT * FROM budgets');
        return result[0]?.values?.map((row: any[]) => ({
          id: String(row[0]),
          title: String(row[1]),
          budget: Number(row[2]),
          spent: Number(row[3]),
          type: row[4] as 'budget'
        })) || [];
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des budgets:", error);
      throw error;
    }
  }

  async addBudget(budget: Budget) {
    try {
      await this.executeWithDelay(() => {
        this.db.run('BEGIN TRANSACTION');
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
          this.db.run('COMMIT');
        } catch (error) {
          this.db.run('ROLLBACK');
          throw error;
        }
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du budget:", error);
      throw error;
    }
  }

  async updateBudget(budget: Budget) {
    try {
      await this.executeWithDelay(() => {
        this.db.run('BEGIN TRANSACTION');
        try {
          this.db.run(
            'UPDATE budgets SET title = ?, budget = ?, spent = ? WHERE id = ?',
            [
              String(budget.title),
              Number(budget.budget),
              Number(budget.spent),
              String(budget.id)
            ]
          );
          this.db.run('COMMIT');
        } catch (error) {
          this.db.run('ROLLBACK');
          throw error;
        }
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du budget:", error);
      throw error;
    }
  }

  async deleteBudget(id: string) {
    try {
      await this.executeWithDelay(() => {
        this.db.run('BEGIN TRANSACTION');
        try {
          this.db.run('DELETE FROM budgets WHERE id = ?', [String(id)]);
          this.db.run('COMMIT');
        } catch (error) {
          this.db.run('ROLLBACK');
          throw error;
        }
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du budget:", error);
      throw error;
    }
  }
}
