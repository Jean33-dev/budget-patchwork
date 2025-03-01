
import initSqlJs from 'sql.js';
import { toast } from "@/components/ui/use-toast";
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { incomeQueries } from './queries/income-queries';
import { expenseQueries } from './queries/expense-queries';
import { budgetQueries } from './queries/budget-queries';
import { categoryQueries } from './queries/category-queries';

export class DatabaseManager {
  private db: any = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;

    try {
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });
      
      this.db = new SQL.Database();
      
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

      this.initialized = true;
      console.log("Base de données initialisée avec les données de test");

    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la base de données:', err);
      throw err;
    }
  }

  private async migrateFromLocalStorage() {
    // Migrer les revenus
    const storedIncomes = localStorage.getItem('app_incomes');
    if (storedIncomes) {
      const incomes = JSON.parse(storedIncomes);
      for (const income of incomes) {
        await this.addIncome(income);
      }
    }

    // Migrer les dépenses
    const storedExpenses = localStorage.getItem('app_expenses');
    if (storedExpenses) {
      const expenses = JSON.parse(storedExpenses);
      for (const expense of expenses) {
        await this.addExpense(expense);
      }
    }

    // Migrer les budgets
    const storedBudgets = localStorage.getItem('app_budgets');
    if (storedBudgets) {
      const budgets = JSON.parse(storedBudgets);
      for (const budget of budgets) {
        await this.addBudget(budget);
      }
    }

    // Migrer les catégories
    const storedCategories = localStorage.getItem('app_categories');
    if (storedCategories) {
      const categories = JSON.parse(storedCategories);
      for (const category of categories) {
        await this.addCategory(category);
      }
    }

    // Supprimer les anciennes données du localStorage
    localStorage.removeItem('app_incomes');
    localStorage.removeItem('app_expenses');
    localStorage.removeItem('app_budgets');
    localStorage.removeItem('app_categories');
  }

  // Income methods
  async getIncomes(): Promise<Income[]> {
    if (!this.initialized) await this.init();
    return incomeQueries.getAll(this.db);
  }

  async addIncome(income: Income) {
    if (!this.initialized) await this.init();
    incomeQueries.add(this.db, income);
  }

  async updateIncome(income: Income) {
    if (!this.initialized) await this.init();
    incomeQueries.update(this.db, income);
  }

  async deleteIncome(id: string) {
    if (!this.initialized) await this.init();
    incomeQueries.delete(this.db, id);
  }

  // Expense methods
  async getExpenses(): Promise<Expense[]> {
    if (!this.initialized) await this.init();
    return expenseQueries.getAll(this.db);
  }

  async addExpense(expense: Expense) {
    if (!this.initialized) await this.init();
    expenseQueries.add(this.db, expense);
  }

  async updateExpense(expense: Expense) {
    if (!this.initialized) await this.init();
    expenseQueries.update(this.db, expense);
  }

  async deleteExpense(id: string) {
    if (!this.initialized) await this.init();
    expenseQueries.delete(this.db, id);
  }

  // Budget methods
  async getBudgets(): Promise<Budget[]> {
    if (!this.initialized) await this.init();
    return budgetQueries.getAll(this.db);
  }

  async addBudget(budget: Budget) {
    if (!this.initialized) await this.init();
    
    try {
      console.log("Ajout d'un nouveau budget:", budget);
      budgetQueries.add(this.db, budget);
      console.log("Budget ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du budget:", error);
      throw error;
    }
  }

  async updateBudget(budget: Budget) {
    if (!this.initialized) await this.init();
    budgetQueries.update(this.db, budget);
  }

  async deleteBudget(id: string) {
    if (!this.initialized) await this.init();
    budgetQueries.delete(this.db, id);
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    if (!this.initialized) await this.init();
    return categoryQueries.getAll(this.db);
  }

  async addCategory(category: Category) {
    if (!this.initialized) await this.init();
    categoryQueries.add(this.db, category);
  }

  async updateCategory(category: Category) {
    if (!this.initialized) await this.init();
    
    try {
      categoryQueries.update(this.db, category);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la catégorie:", error);
      
      // If the category doesn't exist, create it
      const result = this.db.exec(
        'SELECT * FROM categories WHERE id = ?',
        [category.id]
      );
      
      if (!result[0]) {
        console.error("La catégorie n'existe pas, tentative de création");
        await this.addCategory(category);
      } else {
        throw error;
      }
    }
  }

  async deleteCategory(id: string) {
    if (!this.initialized) await this.init();
    categoryQueries.delete(this.db, id);
  }

  // Save database
  exportData() {
    return this.db?.export();
  }
}
