
import { Expense } from '../models/expense';
import { BaseDatabaseManager } from '../base-database-manager';
import { IExpenseManager } from '../interfaces/IExpenseManager';
import { IQueryManager } from '../interfaces/IQueryManager';
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

/**
 * Responsible for handling expense-related database operations
 */
export class ExpenseManager extends BaseDatabaseManager implements IExpenseManager {
  /**
   * Get all expenses from the database
   */
  async getExpenses(): Promise<Expense[]> {
    console.log("🔍 ExpenseManager.getExpenses called");
    await this.ensureInitialized();
    const expenses = await this.queryManager.executeGetExpenses();
    console.log(`🔍 ExpenseManager.getExpenses returning ${expenses.length} expenses with dashboardIds:`, 
      expenses.map(e => ({ id: e.id, title: e.title, dashboardId: e.dashboardId })));
    return expenses;
  }

  /**
   * Get recurring expenses from the database
   */
  async getRecurringExpenses(): Promise<Expense[]> {
    console.log("🔍 ExpenseManager.getRecurringExpenses called");
    await this.ensureInitialized();
    const recurringExpenses = await this.queryManager.executeGetRecurringExpenses();
    console.log(`🔍 ExpenseManager.getRecurringExpenses returning ${recurringExpenses.length} expenses with dashboardIds:`, 
      recurringExpenses.map(e => ({ id: e.id, title: e.title, dashboardId: e.dashboardId })));
    return recurringExpenses;
  }

  /**
   * Add a new expense to the database
   */
  async addExpense(expense: Expense): Promise<void> {
    console.log("🔍 ExpenseManager.addExpense called with expense:", expense);
    
    // Vérification et correction du dashboardId
    if (!expense.dashboardId) {
      console.error("🔍 ExpenseManager.addExpense: dashboardId manquant, tentative de récupération depuis localStorage");
      const storedDashboardId = typeof window !== 'undefined' ? localStorage.getItem('currentDashboardId') : null;
      
      if (storedDashboardId) {
        console.log(`🔍 ExpenseManager.addExpense: dashboardId récupéré de localStorage: ${storedDashboardId}`);
        expense.dashboardId = storedDashboardId;
      } else {
        console.error("🔍 ExpenseManager.addExpense: aucun dashboardId disponible");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'ajouter une dépense sans tableau de bord associé"
        });
        return;
      }
    }
    
    await this.ensureInitialized();
    await this.queryManager.executeAddExpense(expense);
    console.log("🔍 ExpenseManager.addExpense completed");
  }

  /**
   * Update an expense in the database
   */
  async updateExpense(expense: Expense): Promise<void> {
    console.log("🔍 ExpenseManager.updateExpense called with expense:", expense);
    
    // Vérification et correction du dashboardId
    if (!expense.dashboardId) {
      console.error("🔍 ExpenseManager.updateExpense: dashboardId manquant, tentative de récupération depuis localStorage");
      const storedDashboardId = typeof window !== 'undefined' ? localStorage.getItem('currentDashboardId') : null;
      
      if (storedDashboardId) {
        console.log(`🔍 ExpenseManager.updateExpense: dashboardId récupéré de localStorage: ${storedDashboardId}`);
        expense.dashboardId = storedDashboardId;
      } else {
        console.error("🔍 ExpenseManager.updateExpense: aucun dashboardId disponible");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour une dépense sans tableau de bord associé"
        });
        return;
      }
    }
    
    await this.ensureInitialized();
    await this.queryManager.executeUpdateExpense(expense);
    console.log("🔍 ExpenseManager.updateExpense completed");
  }

  /**
   * Delete an expense from the database
   */
  async deleteExpense(id: string): Promise<void> {
    console.log(`🔍 ExpenseManager.deleteExpense called for id: ${id}`);
    await this.ensureInitialized();
    await this.queryManager.executeDeleteExpense(id);
    console.log("🔍 ExpenseManager.deleteExpense completed");
  }
  
  /**
   * Copy a recurring expense to a specific month
   */
  async copyRecurringExpenseToMonth(expenseId: string, targetDate: string): Promise<void> {
    console.log(`🔍 ExpenseManager.copyRecurringExpenseToMonth called for expenseId: ${expenseId} and targetDate: ${targetDate}`);
    await this.ensureInitialized();
    
    try {
      // Get the recurring expense
      const expenses = await this.getExpenses();
      const recurringExpense = expenses.find(expense => expense.id === expenseId && expense.isRecurring);
      
      if (!recurringExpense) {
        throw new Error("Dépense récurrente non trouvée");
      }
      
      console.log(`🔍 Found recurring expense to copy:`, recurringExpense);
      
      // Create a new expense based on the recurring one
      const newExpense: Expense = {
        id: uuidv4(), // Utiliser UUID pour garantir l'unicité
        title: recurringExpense.title,
        budget: recurringExpense.budget,
        spent: recurringExpense.budget, // Définir spent = budget
        type: 'expense',
        linkedBudgetId: recurringExpense.linkedBudgetId,
        date: targetDate,
        isRecurring: false, // The copy is not recurring
        dashboardId: recurringExpense.dashboardId // Conserver le même dashboardId
      };
      
      console.log(`🔍 New expense created from recurring one:`, newExpense);
      await this.addExpense(newExpense);
      
      toast({
        title: "Succès",
        description: `La dépense récurrente "${recurringExpense.title}" a été ajoutée au mois actuel.`
      });
      
      console.log("🔍 ExpenseManager.copyRecurringExpenseToMonth completed successfully");
    } catch (error) {
      console.error("🔍 Erreur lors de la copie de la dépense récurrente :", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier la dépense récurrente"
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
