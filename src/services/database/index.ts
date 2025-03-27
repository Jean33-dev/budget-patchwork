
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { databaseService } from './database-service';
import { DatabaseManager } from './database-manager';

// Création d'une instance unique de DatabaseManager
const databaseManager = new DatabaseManager();

// Export de la base de données
export const db = databaseService;

// Export du gestionnaire de base de données
export const dbManager = databaseManager;

// Export des types
export type { Income, Expense, Budget, Category };
