
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { databaseService } from './database-service';

// Export the database instance
export const db = databaseService;

// Export types
export type { Income, Expense, Budget, Category };
