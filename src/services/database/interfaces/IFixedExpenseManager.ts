
import { FixedExpense } from '../models/fixedExpense';
import { IQueryManager } from './IQueryManager';

/**
 * Interface for fixed expense manager operations
 */
export interface IFixedExpenseManager {
  setDb(db: any): void;
  setInitialized(value: boolean): void;
  setQueryManager(queryManager: IQueryManager): void;
  
  getFixedExpenses(): Promise<FixedExpense[]>;
  addFixedExpense(fixedExpense: FixedExpense): Promise<void>;
  updateFixedExpense(fixedExpense: FixedExpense): Promise<void>;
  deleteFixedExpense(id: string): Promise<void>;
  deleteFixedExpenseIfExists(id: string): Promise<void>;
  updateFixedExpensesDates(newDate: string): Promise<void>;
}
