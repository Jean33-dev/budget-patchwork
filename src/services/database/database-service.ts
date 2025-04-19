
import { IDatabaseManager } from './interfaces/IDatabaseManager';
import { DatabaseManagerFactory } from './database-manager-factory';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { Expense } from './models/expense';
import { Income } from './models/income';
import { Dashboard } from './models/dashboard';
import { toast } from "@/components/ui/use-toast";

class DatabaseService {
  private manager: IDatabaseManager;
  private initialized = false;
  private initializationPromise: Promise<boolean> | null = null;
  private initStartTime: number | null = null;
  private readonly MAX_INIT_TIME_MS = 10000; // 10 seconds max

  constructor() {
    this.manager = DatabaseManagerFactory.getDatabaseManager();
  }

  /**
   * Initialize the database
   */
  async init(): Promise<boolean> {
    try {
      // If already initialized, return true
      if (this.initialized) {
        console.log("DatabaseService: Already initialized, skipping initialization");
        return true;
      }
      
      // If initialization is in progress, check for timeout
      if (this.initializationPromise) {
        console.log("DatabaseService: Initialization already in progress");
        
        // Check if it's been running too long
        if (this.initStartTime && Date.now() - this.initStartTime > this.MAX_INIT_TIME_MS) {
          console.warn(`DatabaseService: Initialization has been running for more than ${this.MAX_INIT_TIME_MS}ms, resetting`);
          this.initializationPromise = null;
          this.initStartTime = null;
          this.resetInitializationAttempts();
        } else {
          // Return existing promise with timeout
          return Promise.race([
            this.initializationPromise,
            new Promise<boolean>(resolve => {
              setTimeout(() => {
                console.warn("DatabaseService: Initialization promise timed out");
                resolve(false);
              }, 5000); // 5 second timeout for waiting on existing promise
            })
          ]);
        }
      }
      
      console.log("DatabaseService: Initializing database...");
      this.initStartTime = Date.now();
      
      // Create a new initialization promise with timeout
      this.initializationPromise = (async () => {
        try {
          // Timeout for the manager initialization
          const initResult = await Promise.race([
            this.manager.init(),
            new Promise<boolean>(resolve => {
              setTimeout(() => {
                console.warn("DatabaseService: Manager initialization timed out");
                resolve(false);
              }, this.MAX_INIT_TIME_MS);
            })
          ]);
          
          if (initResult) {
            console.log("DatabaseService: Initialization successful");
            this.initialized = true;
            
            // After successful initialization, ensure default dashboard exists
            await this.ensureDefaultDashboard();
            return true;
          } else {
            console.error("DatabaseService: Initialization failed or timed out");
            return false;
          }
        } catch (error) {
          console.error("DatabaseService: Error during initialization:", error);
          toast({
            variant: "destructive",
            title: "Erreur de base de données",
            description: "Impossible d'initialiser la base de données. Veuillez rafraîchir la page."
          });
          return false;
        } finally {
          // Clear initialization state
          this.initializationPromise = null;
          this.initStartTime = null;
        }
      })();
      
      return await this.initializationPromise;
    } catch (error) {
      console.error("DatabaseService: Error during initialization:", error);
      this.initializationPromise = null;
      this.initStartTime = null;
      
      toast({
        variant: "destructive",
        title: "Erreur de base de données",
        description: "Impossible d'initialiser la base de données. Veuillez rafraîchir la page."
      });
      return false;
    }
  }

  /**
   * Ensure default dashboard exists
   */
  private async ensureDefaultDashboard(): Promise<void> {
    try {
      const dashboards = await this.getDashboards();
      
      if (dashboards.length === 0) {
        console.log("DatabaseService: No dashboards found, creating default dashboard");
        const defaultDashboard = {
          id: "default",
          title: "Budget Personnel",
          createdAt: new Date().toISOString(),
          lastAccessed: new Date().toISOString()
        };
        
        await this.safeAddDashboard(defaultDashboard);
      } else {
        console.log("DatabaseService: Existing dashboards found:", dashboards.length);
      }
    } catch (error) {
      console.error("DatabaseService: Error ensuring default dashboard:", error);
    }
  }

  /**
   * Check if the database is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Reset initialization attempts
   */
  resetInitializationAttempts(): void {
    console.log("DatabaseService: Resetting initialization attempts");
    this.initialized = false;
    this.initializationPromise = null;
    this.initStartTime = null;
    this.manager.resetInitializationAttempts?.();
  }

  /**
   * Safely add a dashboard (doesn't throw exceptions)
   */
  async safeAddDashboard(dashboard: Dashboard): Promise<boolean> {
    try {
      await this.init(); // Ensure database is initialized
      console.log(`DatabaseService: Safely adding dashboard: ${dashboard.id}`);
      return await this.manager.safeAddDashboard(dashboard);
    } catch (error) {
      console.error("DatabaseService: Error in safeAddDashboard:", error);
      return false;
    }
  }

  /* Budget Methods */
  async getBudgets(): Promise<Budget[]> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Getting budgets");
    return this.manager.getBudgetManager().getBudgets();
  }

  async addBudget(budget: Budget): Promise<void> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Adding budget:", budget.title);
    return this.manager.getBudgetManager().addBudget(budget);
  }

  async updateBudget(budget: Budget): Promise<void> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Updating budget:", budget.id);
    return this.manager.getBudgetManager().updateBudget(budget);
  }

  async deleteBudget(id: string): Promise<void> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Deleting budget:", id);
    return this.manager.getBudgetManager().deleteBudget(id);
  }

  /* Category Methods */
  async getCategories(): Promise<Category[]> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Getting categories");
    return this.manager.getCategoryManager().getCategories();
  }

  async addCategory(category: Category): Promise<void> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Adding category:", category.name);
    return this.manager.getCategoryManager().addCategory(category);
  }

  async updateCategory(category: Category): Promise<void> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Updating category:", category.id);
    return this.manager.getCategoryManager().updateCategory(category);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Deleting category:", id);
    return this.manager.getCategoryManager().deleteCategory(id);
  }

  /* Expense Methods */
  async getExpenses(): Promise<Expense[]> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Getting expenses");
    return this.manager.getExpenseManager().getExpenses();
  }

  async getRecurringExpenses(): Promise<Expense[]> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Getting recurring expenses");
    return this.manager.getExpenseManager().getRecurringExpenses();
  }

  async addExpense(expense: Expense): Promise<void> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Adding expense:", expense.title);
    return this.manager.getExpenseManager().addExpense(expense);
  }

  async updateExpense(expense: Expense): Promise<void> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Updating expense:", expense.id);
    return this.manager.getExpenseManager().updateExpense(expense);
  }

  async deleteExpense(id: string): Promise<void> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Deleting expense:", id);
    return this.manager.getExpenseManager().deleteExpense(id);
  }

  async copyRecurringExpenseToMonth(expenseId: string, targetDate: string): Promise<void> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Copying recurring expense:", expenseId, "to", targetDate);
    return this.manager.getExpenseManager().copyRecurringExpenseToMonth(expenseId, targetDate);
  }

  /* Income Methods */
  async getIncomes(): Promise<Income[]> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Getting incomes");
    return this.manager.getIncomeManager().getIncomes();
  }

  async getRecurringIncomes(): Promise<Income[]> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Getting recurring incomes");
    return this.manager.getIncomeManager().getRecurringIncomes();
  }

  async addIncome(income: Income): Promise<void> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Adding income:", income.title);
    return this.manager.getIncomeManager().addIncome(income);
  }

  async updateIncome(income: Income): Promise<void> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Updating income:", income.id);
    return this.manager.getIncomeManager().updateIncome(income);
  }

  async deleteIncome(id: string): Promise<void> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Deleting income:", id);
    return this.manager.getIncomeManager().deleteIncome(id);
  }

  async copyRecurringIncomeToMonth(incomeId: string, targetDate: string): Promise<void> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Copying recurring income:", incomeId, "to", targetDate);
    return this.manager.getIncomeManager().copyRecurringIncomeToMonth(incomeId, targetDate);
  }

  /* Dashboard Methods */
  async getDashboards(): Promise<Dashboard[]> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Getting dashboards");
    return this.manager.getDashboardManager().getDashboards();
  }

  async addDashboard(dashboard: Dashboard): Promise<void> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Adding dashboard:", dashboard.title);
    return this.manager.getDashboardManager().addDashboard(dashboard);
  }

  async updateDashboard(dashboard: Dashboard): Promise<void> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Updating dashboard:", dashboard.id);
    return this.manager.getDashboardManager().updateDashboard(dashboard);
  }

  async deleteDashboard(id: string): Promise<void> {
    await this.init(); // Ensure database is initialized
    console.log("DatabaseService: Deleting dashboard:", id);
    return this.manager.getDashboardManager().deleteDashboard(id);
  }
}

// Export as a named constant 'databaseService'
export const databaseService = new DatabaseService();
// Also export as 'db' for backward compatibility
export const db = databaseService;
