
import { Income } from '@/types/database-types';

export class IncomeOperations {
  constructor(private db: any) {}

  async getIncomes(): Promise<Income[]> {
    const result = this.db.exec('SELECT * FROM incomes');
    return result[0]?.values?.map((row: any[]) => ({
      id: String(row[0]),
      title: String(row[1]),
      budget: Number(row[2]),
      spent: Number(row[3]),
      type: row[4] as 'income'
    })) || [];
  }

  async addIncome(income: Income) {
    this.db.run(
      'INSERT INTO incomes (id, title, budget, spent, type) VALUES (?, ?, ?, ?, ?)',
      [income.id, income.title, Number(income.budget), Number(income.spent), income.type]
    );
  }

  async updateIncome(income: Income) {
    this.db.run(
      'UPDATE incomes SET title = ?, budget = ?, spent = ? WHERE id = ?',
      [income.title, Number(income.budget), Number(income.spent), income.id]
    );
  }

  async deleteIncome(id: string) {
    this.db.run('DELETE FROM incomes WHERE id = ?', [id]);
  }
}
