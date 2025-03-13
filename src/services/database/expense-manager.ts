
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

  async updateExpense(expense: Expense): Promise<boolean> {
    try {
      console.log(`Début de la mise à jour de la dépense avec l'ID: ${expense.id}`);
      await this.ensureInitialized();
      
      if (!expense.id) {
        console.error("Tentative de mise à jour avec un ID invalide");
        return false;
      }
      
      const result = expenseQueries.update(this.db, expense);
      console.log(`Dépense avec l'ID ${expense.id} mise à jour avec succès:`, result);
      return result;
    } catch (error) {
      console.error(`Erreur dans ExpenseManager.updateExpense pour l'ID ${expense.id}:`, error);
      return false;
    }
  }

  async deleteExpense(id: string): Promise<boolean> {
    try {
      console.time('deleteExpense');
      await this.ensureInitialized();
      
      if (!id) {
        console.error("Tentative de suppression avec un ID invalide");
        return false;
      }
      
      // Suppression avec retour d'état
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
