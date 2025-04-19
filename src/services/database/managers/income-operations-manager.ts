
import { toast } from "@/components/ui/use-toast";
import { Income } from '../models/income';
import { DatabaseManagerFactory } from '../database-manager-factory';

export class IncomeOperationsManager {
  private ensureInitialized: () => Promise<boolean>;
  private managerFactory: DatabaseManagerFactory;

  constructor(
    ensureInitialized: () => Promise<boolean>,
    managerFactory: DatabaseManagerFactory
  ) {
    this.ensureInitialized = ensureInitialized;
    this.managerFactory = managerFactory;
  }

  async getIncomes(): Promise<Income[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getIncomes");
        return [];
      }
      return this.managerFactory.getIncomeManager().getIncomes();
    } catch (error) {
      console.error("Error in getIncomes:", error);
      return [];
    }
  }

  async getRecurringIncomes(): Promise<Income[]> {
    try {
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        console.error("Database not initialized in getRecurringIncomes");
        return [];
      }
      return this.managerFactory.getIncomeManager().getRecurringIncomes();
    } catch (error) {
      console.error("Error in getRecurringIncomes:", error);
      return [];
    }
  }

  async addIncome(income: Income): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in addIncome");
    }
    await this.managerFactory.getIncomeManager().addIncome(income);
  }

  async updateIncome(income: Income): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in updateIncome");
    }
    await this.managerFactory.getIncomeManager().updateIncome(income);
  }

  async deleteIncome(id: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in deleteIncome");
    }
    await this.managerFactory.getIncomeManager().deleteIncome(id);
  }

  async copyRecurringIncomeToMonth(incomeId: string, targetDate: string): Promise<void> {
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      throw new Error("Database not initialized in copyRecurringIncomeToMonth");
    }
    await this.managerFactory.getIncomeManager().copyRecurringIncomeToMonth(incomeId, targetDate);
  }
}
