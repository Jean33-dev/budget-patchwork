
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
      await this.ensureInitialized();
      
      // Vérifier que l'ID n'est pas vide ou undefined
      if (!id) {
        console.error("Tentative de suppression avec un ID invalide");
        return false;
      }
      
      // Vérifier si l'expense existe avant de tenter de la supprimer
      const expenses = await this.getExpenses();
      const expenseExists = expenses.some(expense => expense.id === id);
      
      if (!expenseExists) {
        console.warn(`Aucune dépense trouvée avec l'ID: ${id}`);
        return false;
      }
      
      // Utiliser la fonction de suppression qui retourne un statut
      const deleteStatus = expenseQueries.delete(this.db, id);
      console.log(`Résultat de la suppression pour ID ${id}:`, deleteStatus);
      
      // Retourner le statut de la suppression
      return deleteStatus;
    } catch (error) {
      console.error(`Erreur dans ExpenseManager.deleteExpense pour l'ID ${id}:`, error);
      return false;
    }
  }
}
