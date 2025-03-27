
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { databaseService } from './database-service';
import { DatabaseManager } from './database-manager';

// Create a single instance of DatabaseManager
const databaseManager = new DatabaseManager();

// Export the database
export const db = databaseService;

// Export the database manager
export const dbManager = databaseManager;

// Export types
export type { Income, Expense, Budget, Category };
