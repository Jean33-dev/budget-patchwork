
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { DatabaseService } from './database-service';

// Export the database instance
export const db = new DatabaseService();

// Export types
export type { Income, Expense, Budget, Category };
