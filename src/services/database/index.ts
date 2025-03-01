
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { DatabaseManager } from './database-manager';

// Export the database instance
export const db = new DatabaseManager();

// Export types
export type { Income, Expense, Budget, Category };
