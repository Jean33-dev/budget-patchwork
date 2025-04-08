
import { Income } from '../models/income';
import { IQueryManager } from './IQueryManager';

/**
 * Interface for income manager operations
 */
export interface IIncomeManager {
  setDb(db: any): void;
  setInitialized(value: boolean): void;
  setQueryManager(queryManager: IQueryManager): void;
  
  getIncomes(): Promise<Income[]>;
  getRecurringIncomes(): Promise<Income[]>;
  addIncome(income: Income): Promise<void>;
  updateIncome(income: Income): Promise<void>;
  deleteIncome(id: string): Promise<void>;
  copyRecurringIncomeToMonth(incomeId: string, targetDate: string): Promise<void>;
}
