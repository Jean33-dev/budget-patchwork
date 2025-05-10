import { toast } from "@/components/ui/use-toast";
import { Expense } from '../../models/expense';
import { ExpenseBaseService } from './expense-base-service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for handling recurring expense operations
 */
export class ExpenseRecurringService extends ExpenseBaseService {
  /**
   * Copy a recurring expense to a specific month
   */
  async copyRecurringExpenseToMonth(expenseId: string, targetDate: string): Promise<void> {
    try {
      if (!await this.ensureDatabase()) return;
      
      // Get the recurring expense
      const adapter = this.initManager.getAdapter();
      const expenses = await adapter!.query("SELECT * FROM expenses");
      const recurringExpense = expenses.find(expense => expense.id === expenseId && expense.isRecurring);
      
      if (!recurringExpense) {
        throw new Error("Dépense récurrente non trouvée");
      }
      
      console.log(`Copie de la dépense récurrente "${recurringExpense.title}" au mois actuel...`);
      
      // Normalize dashboardId as a non-empty string
      const dashboardId = recurringExpense.dashboardId && String(recurringExpense.dashboardId).trim() !== "" 
        ? String(recurringExpense.dashboardId) 
        : "default";
      
      // Create a new expense based on the recurring one with a guaranteed unique ID
      const newExpense: Expense = {
        id: uuidv4(), // Utiliser UUID pour garantir l'unicité
        title: recurringExpense.title,
        budget: recurringExpense.budget,
        spent: recurringExpense.budget, // Définir spent = budget
        type: 'expense',
        linkedBudgetId: recurringExpense.linkedBudgetId,
        date: targetDate,
        isRecurring: false, // The copy is not recurring
        dashboardId: dashboardId // Toujours une chaîne non vide
      };
      
      console.log("Nouvelle dépense à ajouter:", JSON.stringify(newExpense));
      
      // Vérifier que le budget associé existe toujours
      const allBudgets = await adapter!.query("SELECT * FROM budgets WHERE id = ?", [recurringExpense.linkedBudgetId]);
      if (allBudgets.length === 0) {
        throw new Error(`Le budget associé (ID: ${recurringExpense.linkedBudgetId}) n'existe plus`);
      }
      
      // Ajouter la nouvelle dépense à la base de données
      await adapter!.run(
        'INSERT INTO expenses (id, title, budget, spent, type, linkedBudgetId, date, isRecurring, dashboardId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [newExpense.id, newExpense.title, newExpense.budget, newExpense.spent, newExpense.type, newExpense.linkedBudgetId, newExpense.date, newExpense.isRecurring ? 1 : 0, dashboardId]
      );
      
      // Mise à jour du montant dépensé dans le budget associé
      const budgetQuery = await adapter!.query(
        "SELECT * FROM budgets WHERE id = ?", 
        [recurringExpense.linkedBudgetId]
      );
      
      if (budgetQuery.length > 0) {
        const budget = budgetQuery[0];
        const newSpent = Number(budget.spent || 0) + Number(recurringExpense.budget);
        
        console.log(`Mise à jour du montant dépensé dans le budget ${budget.title} de ${budget.spent} à ${newSpent}`);
        
        await adapter!.run(
          "UPDATE budgets SET spent = ? WHERE id = ?",
          [newSpent, recurringExpense.linkedBudgetId]
        );
      }
      
      toast({
        title: "Succès",
        description: `La dépense récurrente "${recurringExpense.title}" a été ajoutée au mois actuel.`
      });
    } catch (error) {
      console.error("Erreur lors de la copie de la dépense récurrente :", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier la dépense récurrente"
      });
    }
  }
}
