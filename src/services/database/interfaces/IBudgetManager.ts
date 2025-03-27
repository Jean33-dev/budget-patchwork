
import { Budget } from '../models/budget';
import { IQueryManager } from './IQueryManager';

/**
 * Interface for budget manager operations
 */
export interface IBudgetManager {
  setDb(db: any): void;
  setInitialized(value: boolean): void;
  setQueryManager(queryManager: IQueryManager): void;
  
  getBudgets(): Promise<Budget[]>;
  addBudget(budget: Budget): Promise<void>;
  updateBudget(budget: Budget): Promise<void>;
  deleteBudget(id: string): Promise<void>;
}
