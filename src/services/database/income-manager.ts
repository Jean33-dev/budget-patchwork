
import { BaseDatabaseManager } from './base-database-manager';
import { Income } from './models/income';
import { incomeQueries } from './queries/income-queries';

export class IncomeManager extends BaseDatabaseManager {
  async getIncomes(): Promise<Income[]> {
    await this.ensureInitialized();
    return incomeQueries.getAll(this.db);
  }

  async addIncome(income: Income) {
    await this.ensureInitialized();
    incomeQueries.add(this.db, income);
  }

  async updateIncome(income: Income) {
    await this.ensureInitialized();
    incomeQueries.update(this.db, income);
  }

  async deleteIncome(id: string) {
    await this.ensureInitialized();
    incomeQueries.delete(this.db, id);
  }
}
