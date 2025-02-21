
import { Budget } from "./categories";

export interface CategoryBudgetUpdate {
  id: string;
  total: number;
  spent: number;
  budgets: string[];
}

export interface BudgetAssignmentUtils {
  getAssignedBudgets: (categories: any[]) => Set<string>;
  getAvailableBudgetsForCategory: (categoryId: string, availableBudgets: Budget[]) => Budget[];
}
