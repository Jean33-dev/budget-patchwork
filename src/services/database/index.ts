
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { Dashboard } from './models/dashboard';
import { databaseService } from './database-service';
import { DatabaseManager } from './database-manager';
import { IDatabaseManager } from './interfaces/IDatabaseManager';
import { IBudgetManager } from './interfaces/IBudgetManager';
import { IExpenseManager } from './interfaces/IExpenseManager';
import { IIncomeManager } from './interfaces/IIncomeManager';
import { ICategoryManager } from './interfaces/ICategoryManager';
import { IDashboardManager } from './interfaces/IDashboardManager';
import { IQueryManager } from './interfaces/IQueryManager';

// Création d'une instance unique de DatabaseManager
const databaseManager = new DatabaseManager();

// Export de la base de données
export const db = databaseService;

// Export du gestionnaire de base de données
export const dbManager = databaseManager;

// Export des gestionnaires de requêtes
export { QueryManager } from './query-manager';
export { IncomeQueryManager } from './query-managers/income-query-manager';
export { ExpenseQueryManager } from './query-managers/expense-query-manager';
export { BudgetQueryManager } from './query-managers/budget-query-manager';
export { CategoryQueryManager } from './query-managers/category-query-manager';
export { DashboardQueryManager } from './query-managers/dashboard-query-manager';

// Export des interfaces
export type { 
  IDatabaseManager, 
  IBudgetManager, 
  IExpenseManager, 
  IIncomeManager, 
  ICategoryManager,
  IDashboardManager,
  IQueryManager 
};

// Export des types
export type { Income, Expense, Budget, Category, Dashboard };
