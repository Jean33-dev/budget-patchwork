
import { FixedIncome } from '../models/fixedIncome';
import { IQueryManager } from './IQueryManager';

/**
 * Interface for fixed income manager operations
 */
export interface IFixedIncomeManager {
  setDb(db: any): void;
  setInitialized(value: boolean): void;
  setQueryManager(queryManager: IQueryManager): void;
  
  getFixedIncomes(): Promise<FixedIncome[]>;
  addFixedIncome(fixedIncome: FixedIncome): Promise<void>;
  updateFixedIncome(fixedIncome: FixedIncome): Promise<void>;
  deleteFixedIncome(id: string): Promise<void>;
  deleteFixedIncomeIfExists(id: string): Promise<void>;
  updateFixedIncomesDates(newDate: string): Promise<void>;
}
