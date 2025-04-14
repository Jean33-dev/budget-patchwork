
import { QueryManager } from './query-manager';
import { IncomeManager } from './managers/income-manager';
import { ExpenseManager } from './managers/expense-manager';
import { BudgetManager } from './managers/budget-manager';
import { CategoryManager } from './managers/category-manager';
import { DashboardManager } from './managers/dashboard-manager';

/**
 * Factory for creating and managing database manager instances
 */
export class DatabaseManagerFactory {
  private queryManager: QueryManager | null = null;
  private incomeManager: IncomeManager | null = null;
  private expenseManager: ExpenseManager | null = null;
  private budgetManager: BudgetManager | null = null;
  private categoryManager: CategoryManager | null = null;
  private dashboardManager: DashboardManager | null = null;

  constructor() {
    this.queryManager = new QueryManager();
  }

  initializeManagers(db: any): void {
    if (this.queryManager) {
      this.queryManager.setDb(db);
    }
  }

  getIncomeManager(): IncomeManager {
    if (!this.incomeManager) {
      this.incomeManager = new IncomeManager(this.queryManager!);
    }
    return this.incomeManager;
  }

  getExpenseManager(): ExpenseManager {
    if (!this.expenseManager) {
      this.expenseManager = new ExpenseManager(this.queryManager!);
    }
    return this.expenseManager;
  }

  getBudgetManager(): BudgetManager {
    if (!this.budgetManager) {
      this.budgetManager = new BudgetManager(this.queryManager!);
    }
    return this.budgetManager;
  }

  getCategoryManager(): CategoryManager {
    if (!this.categoryManager) {
      this.categoryManager = new CategoryManager(this.queryManager!);
    }
    return this.categoryManager;
  }

  getDashboardManager(): DashboardManager {
    if (!this.dashboardManager) {
      this.dashboardManager = new DashboardManager(this.queryManager!);
    }
    return this.dashboardManager;
  }
}
