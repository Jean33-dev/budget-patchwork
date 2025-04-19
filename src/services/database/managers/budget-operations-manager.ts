
import { toast } from "@/components/ui/use-toast";
import { Budget } from '../models/budget';
import { DatabaseManagerFactory } from '../database-manager-factory';

export class BudgetOperationsManager {
  private ensureInitialized: () => Promise<boolean>;
  private managerFactory: DatabaseManagerFactory;

  constructor(
    ensureInitialized: () => Promise<boolean>,
    managerFactory: DatabaseManagerFactory
  ) {
    this.ensureInitialized = ensureInitialized;
    this.managerFactory = managerFactory;
  }

  async getBudgets(): Promise<Budget[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getBudgets");
        return [];
      }
      return this.managerFactory.getBudgetManager().getBudgets();
    } catch (error) {
      console.error("Error in getBudgets:", error);
      return [];
    }
  }

  async addBudget(budget: Budget): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addBudget");
    }
    await this.managerFactory.getBudgetManager().addBudget(budget);
  }

  async updateBudget(budget: Budget): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateBudget");
    }
    await this.managerFactory.getBudgetManager().updateBudget(budget);
  }

  async deleteBudget(id: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteBudget");
    }
    await this.managerFactory.getBudgetManager().deleteBudget(id);
  }
}
