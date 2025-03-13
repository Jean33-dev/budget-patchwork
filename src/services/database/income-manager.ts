
import { BaseDatabaseManager } from './base-database-manager';
import { Income } from './models/income';
import { incomeQueries } from './queries/income-queries';

export class IncomeManager extends BaseDatabaseManager {
  async getIncomes(): Promise<Income[]> {
    await this.ensureInitialized();
    return incomeQueries.getAll(this.db);
  }

  async addIncome(income: Income): Promise<void> {
    await this.ensureInitialized();
    incomeQueries.add(this.db, income);
    return Promise.resolve();
  }

  async updateIncome(income: Income): Promise<void> {
    await this.ensureInitialized();
    incomeQueries.update(this.db, income);
    return Promise.resolve();
  }

  async deleteIncome(id: string): Promise<void> {
    await this.ensureInitialized();
    if (!id) {
      console.error("Tentative de suppression avec un ID invalide");
      return Promise.resolve();
    }
    incomeQueries.delete(this.db, id);
    return Promise.resolve();
  }
}
