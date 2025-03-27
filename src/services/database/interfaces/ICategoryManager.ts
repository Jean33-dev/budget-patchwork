
import { Category } from '../models/category';
import { IQueryManager } from './IQueryManager';

/**
 * Interface for category manager operations
 */
export interface ICategoryManager {
  setDb(db: any): void;
  setInitialized(value: boolean): void;
  setQueryManager(queryManager: IQueryManager): void;
  
  getCategories(): Promise<Category[]>;
  addCategory(category: Category): Promise<void>;
  updateCategory(category: Category): Promise<void>;
  deleteCategory(id: string): Promise<void>;
  resetCategoryExpenses(categoryId: string): Promise<void>;
}
