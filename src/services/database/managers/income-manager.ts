import { toast } from "@/components/ui/use-toast";
import { Income } from '../models/income';
import { BaseDatabaseManager } from '../base-database-manager';
import { IIncomeManager } from '../interfaces/IIncomeManager';
import { IQueryManager } from '../interfaces/IQueryManager';

/**
 * Responsible for handling income-related database operations
 */
export class IncomeManager extends BaseDatabaseManager implements IIncomeManager {
  constructor(queryManager?: IQueryManager) {
    super();
    if (queryManager) {
      this.queryManager = queryManager;
    }
  }

  /**
   * Get all incomes from the database
   */
  async getIncomes(): Promise<Income[]> {
    await this.ensureInitialized();
    return this.queryManager.executeGetIncomes();
  }

  /**
   * Get recurring incomes from the database
   */
  async getRecurringIncomes(): Promise<Income[]> {
    await this.ensureInitialized();
    return this.queryManager.executeGetRecurringIncomes();
  }

  /**
   * Add a new income to the database
   */
  async addIncome(income: Income): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeAddIncome(income);
  }

  /**
   * Update an existing income in the database
   */
  async updateIncome(income: Income): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeUpdateIncome(income);
  }

  /**
   * Delete an income from the database
   */
  async deleteIncome(id: string): Promise<void> {
    await this.ensureInitialized();
    await this.queryManager.executeDeleteIncome(id);
  }
  
  /**
   * Copy a recurring income to a specific month
   */
  async copyRecurringIncomeToMonth(incomeId: string, targetDate: string): Promise<void> {
    await this.ensureInitialized();
    
    try {
      // Get the recurring income
      const incomes = await this.getIncomes();
      const recurringIncome = incomes.find(income => income.id === incomeId && income.isRecurring);
      
      if (!recurringIncome) {
        throw new Error("Revenu récurrent non trouvé");
      }
      
      // Create a new income based on the recurring one
      const newIncome: Income = {
        id: `${recurringIncome.id}_copy_${Date.now()}`,
        title: recurringIncome.title,
        budget: recurringIncome.budget,
        spent: recurringIncome.budget, // Set spent to budget for income
        type: 'income',
        date: targetDate,
        isRecurring: false // The copy is not recurring
      };
      
      await this.addIncome(newIncome);
      
      toast({
        title: "Succès",
        description: `Le revenu récurrent "${recurringIncome.title}" a été ajouté au mois actuel.`
      });
    } catch (error) {
      console.error("Erreur lors de la copie du revenu récurrent :", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le revenu récurrent"
      });
    }
  }
  
  /**
   * Set the query manager for this manager
   */
  setQueryManager(queryManager: IQueryManager): this {
    this.queryManager = queryManager;
    return this;
  }
}
