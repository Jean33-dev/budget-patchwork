
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { FixedExpense } from './models/fixedExpense';
import { FixedIncome } from './models/fixedIncome';
import { IncomeService } from './services/income-service';
import { ExpenseService } from './services/expense-service';
import { BudgetService } from './services/budget-service';
import { CategoryService } from './services/category-service';
import { FixedIncomeService } from './services/fixed-income-service';
import { FixedExpenseService } from './services/fixed-expense-service';

/**
 * Main database service that uses specialized service classes for each entity
 */
class DatabaseService {
  private incomeService: IncomeService;
  private expenseService: ExpenseService;
  private budgetService: BudgetService;
  private categoryService: CategoryService;
  private fixedIncomeService: FixedIncomeService;
  private fixedExpenseService: FixedExpenseService;

  constructor() {
    this.incomeService = new IncomeService();
    this.expenseService = new ExpenseService();
    this.budgetService = new BudgetService();
    this.categoryService = new CategoryService();
    this.fixedIncomeService = new FixedIncomeService();
    this.fixedExpenseService = new FixedExpenseService();
  }

  /**
   * Initializes the database
   */
  async init(): Promise<boolean> {
    // Initialize all services with the same database
    const success = await this.incomeService.init();
    // Other services will use the same database instance
    return success;
  }

  /**
   * Resets the counter of initialization attempts
   */
  resetInitializationAttempts(): void {
    this.incomeService.resetInitializationAttempts();
  }

  // Income methods delegated to IncomeService
  async getIncomes(): Promise<Income[]> {
    return this.incomeService.getIncomes();
  }

  async addIncome(income: Income): Promise<void> {
    return this.incomeService.addIncome(income);
  }

  async updateIncome(income: Income): Promise<void> {
    return this.incomeService.updateIncome(income);
  }

  async deleteIncome(id: string): Promise<void> {
    return this.incomeService.deleteIncome(id);
  }

  // Expense methods delegated to ExpenseService
  async getExpenses(): Promise<Expense[]> {
    return this.expenseService.getExpenses();
  }

  async addExpense(expense: Expense): Promise<void> {
    return this.expenseService.addExpense(expense);
  }

  async updateExpense(expense: Expense): Promise<void> {
    return this.expenseService.updateExpense(expense);
  }

  async deleteExpense(id: string): Promise<void> {
    return this.expenseService.deleteExpense(id);
  }

  // Budget methods delegated to BudgetService
  async getBudgets(): Promise<Budget[]> {
    return this.budgetService.getBudgets();
  }

  async addBudget(budget: Budget): Promise<void> {
    return this.budgetService.addBudget(budget);
  }

  async updateBudget(budget: Budget): Promise<void> {
    return this.budgetService.updateBudget(budget);
  }

  async deleteBudget(id: string): Promise<void> {
    return this.budgetService.deleteBudget(id);
  }

  // Category methods delegated to CategoryService
  async getCategories(): Promise<Category[]> {
    return this.categoryService.getCategories();
  }

  async addCategory(category: Category): Promise<void> {
    return this.categoryService.addCategory(category);
  }

  async updateCategory(category: Category): Promise<void> {
    return this.categoryService.updateCategory(category);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }
  
  // Fixed Income methods delegated to FixedIncomeService
  async getFixedIncomes(): Promise<FixedIncome[]> {
    return this.fixedIncomeService.getFixedIncomes();
  }

  async addFixedIncome(fixedIncome: FixedIncome): Promise<void> {
    return this.fixedIncomeService.addFixedIncome(fixedIncome);
  }

  async updateFixedIncome(fixedIncome: FixedIncome): Promise<void> {
    return this.fixedIncomeService.updateFixedIncome(fixedIncome);
  }

  async deleteFixedIncome(id: string): Promise<void> {
    return this.fixedIncomeService.deleteFixedIncome(id);
  }
  
  async deleteFixedIncomeIfExists(id: string): Promise<void> {
    return this.fixedIncomeService.deleteFixedIncomeIfExists(id);
  }
  
  async updateFixedIncomesDates(newDate: string): Promise<void> {
    return this.fixedIncomeService.updateFixedIncomesDates(newDate);
  }
  
  // Fixed Expense methods delegated to FixedExpenseService
  async getFixedExpenses(): Promise<FixedExpense[]> {
    return this.fixedExpenseService.getFixedExpenses();
  }

  async addFixedExpense(fixedExpense: FixedExpense): Promise<void> {
    return this.fixedExpenseService.addFixedExpense(fixedExpense);
  }

  async updateFixedExpense(fixedExpense: FixedExpense): Promise<void> {
    return this.fixedExpenseService.updateFixedExpense(fixedExpense);
  }

  async deleteFixedExpense(id: string): Promise<void> {
    return this.fixedExpenseService.deleteFixedExpense(id);
  }
  
  async deleteFixedExpenseIfExists(id: string): Promise<void> {
    return this.fixedExpenseService.deleteFixedExpenseIfExists(id);
  }
  
  async updateFixedExpensesDates(newDate: string): Promise<void> {
    return this.fixedExpenseService.updateFixedExpensesDates(newDate);
  }

  /**
   * Exports database data
   */
  exportData(): Uint8Array | null {
    return this.incomeService.exportData();
  }

  /**
   * Imports data into the database
   */
  importData(data: Uint8Array): boolean {
    return this.incomeService.importData(data);
  }
}

// Export a singleton instance of the database service
export const databaseService = new DatabaseService();
