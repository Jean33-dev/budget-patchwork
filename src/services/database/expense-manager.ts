
import { BaseDatabaseManager } from './base-database-manager';
import { Expense } from './models/expense';
import { expenseQueries } from './queries/expense-queries';

export class ExpenseManager extends BaseDatabaseManager {
  async getExpenses(): Promise<Expense[]> {
    try {
      await this.ensureInitialized();
      return await expenseQueries.getAll(this.db);
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
      return [];
    }
  }

  async addExpense(expense: Expense): Promise<void> {
    try {
      await this.ensureInitialized();
      expenseQueries.add(this.db, expense);
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une dépense:", error);
    }
    return Promise.resolve();
  }

  async updateExpense(expense: Expense): Promise<void> {
    try {
      await this.ensureInitialized();
      expenseQueries.update(this.db, expense);
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'une dépense:", error);
    }
    return Promise.resolve();
  }

  async deleteExpense(id: string): Promise<void> {
    try {
      await this.ensureInitialized();
      if (!id) {
        console.error("Tentative de suppression avec un ID invalide");
        return Promise.resolve();
      }
      expenseQueries.delete(this.db, id);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la dépense avec l'ID ${id}:`, error);
    }
    return Promise.resolve();
  }
}
