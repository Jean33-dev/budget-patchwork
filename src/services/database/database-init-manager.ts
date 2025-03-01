
import { BaseDatabaseManager } from './base-database-manager';
import { incomeQueries } from './queries/income-queries';
import { expenseQueries } from './queries/expense-queries';
import { budgetQueries } from './queries/budget-queries';
import { categoryQueries } from './queries/category-queries';

export class DatabaseInitManager extends BaseDatabaseManager {
  async init() {
    if (this.initialized) return;

    try {
      // Initialize the base class
      await super.init();
      
      // Create tables
      this.db.run(incomeQueries.createTable);
      this.db.run(expenseQueries.createTable);
      this.db.run(budgetQueries.createTable);
      this.db.run(categoryQueries.createTable);

      // Add test data
      const currentDate = new Date().toISOString().split('T')[0];
      this.db.run(budgetQueries.sampleData(currentDate));
      this.db.run(
        budgetQueries.expenseSampleData(currentDate), 
        [currentDate, currentDate, currentDate, currentDate]
      );

      console.log("Base de données initialisée avec les données de test");

    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la base de données:', err);
      throw err;
    }
  }

  async migrateFromLocalStorage() {
    await this.ensureInitialized();
    
    // Migrer les revenus
    const storedIncomes = localStorage.getItem('app_incomes');
    if (storedIncomes) {
      const incomes = JSON.parse(storedIncomes);
      for (const income of incomes) {
        incomeQueries.add(this.db, income);
      }
    }

    // Migrer les dépenses
    const storedExpenses = localStorage.getItem('app_expenses');
    if (storedExpenses) {
      const expenses = JSON.parse(storedExpenses);
      for (const expense of expenses) {
        expenseQueries.add(this.db, expense);
      }
    }

    // Migrer les budgets
    const storedBudgets = localStorage.getItem('app_budgets');
    if (storedBudgets) {
      const budgets = JSON.parse(storedBudgets);
      for (const budget of budgets) {
        budgetQueries.add(this.db, budget);
      }
    }

    // Migrer les catégories
    const storedCategories = localStorage.getItem('app_categories');
    if (storedCategories) {
      const categories = JSON.parse(storedCategories);
      for (const category of categories) {
        categoryQueries.add(this.db, category);
      }
    }

    // Supprimer les anciennes données du localStorage
    localStorage.removeItem('app_incomes');
    localStorage.removeItem('app_expenses');
    localStorage.removeItem('app_budgets');
    localStorage.removeItem('app_categories');
  }
}
