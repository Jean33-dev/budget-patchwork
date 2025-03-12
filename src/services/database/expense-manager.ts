
import { BaseDatabaseManager } from './base-database-manager';
import { Expense } from './models/expense';
import { expenseQueries } from './queries/expense-queries';

export class ExpenseManager extends BaseDatabaseManager {
  async getExpenses(): Promise<Expense[]> {
    await this.ensureInitialized();
    return expenseQueries.getAll(this.db);
  }

  async addExpense(expense: Expense) {
    await this.ensureInitialized();
    expenseQueries.add(this.db, expense);
  }

  async updateExpense(expense: Expense) {
    await this.ensureInitialized();
    expenseQueries.update(this.db, expense);
  }

  async deleteExpense(id: string): Promise<boolean> {
    try {
      console.time('deleteExpense');
      await this.ensureInitialized();
      
      if (!id) {
        console.error("Tentative de suppression avec un ID invalide");
        return false;
      }
      
      // Suppression directe sans vérification préalable pour éviter la double requête
      const deleteStatus = expenseQueries.delete(this.db, id);
      console.log(`Résultat de la suppression pour ID ${id}:`, deleteStatus);
      console.timeEnd('deleteExpense');
      
      return deleteStatus;
    } catch (error) {
      console.error(`Erreur dans ExpenseManager.deleteExpense pour l'ID ${id}:`, error);
      console.timeEnd('deleteExpense');
      return false;
    }
  }
}
