import { BaseDatabaseManager } from './base-database-manager';
import { incomeQueries } from './queries/income-queries';
import { expenseQueries } from './queries/expense-queries';
import { budgetQueries } from './queries/budget-queries';
import { categoryQueries } from './queries/category-queries';
import { Income } from './models/income';
import { Expense } from './models/expense';
import { Budget } from './models/budget';
import { Category } from './models/category';
import { toast } from "@/components/ui/use-toast";

export class QueryManager extends BaseDatabaseManager {
  async executeGetIncomes(): Promise<Income[]> {
    try {
      const success = await this.ensureInitialized();
      if (!success || !this.db) return [];
      return incomeQueries.getAll(this.db);
    } catch (error) {
      console.error("Error getting incomes:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les revenus"
      });
      return [];
    }
  }

  async executeAddIncome(income: Income): Promise<void> {
    try {
      const success = await this.ensureInitialized();
      if (!success || !this.db) return;
      incomeQueries.add(this.db, income);
    } catch (error) {
      console.error("Error adding income:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le revenu"
      });
      throw error;
    }
  }

  async executeUpdateIncome(income: Income): Promise<void> {
    try {
      const success = await this.ensureInitialized();
      if (!success || !this.db) return;
      incomeQueries.update(this.db, income);
    } catch (error) {
      console.error("Error updating income:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le revenu"
      });
      throw error;
    }
  }

  async executeDeleteIncome(id: string): Promise<void> {
    try {
      const success = await this.ensureInitialized();
      if (!success || !this.db || !id) return;
      incomeQueries.delete(this.db, id);
    } catch (error) {
      console.error("Error deleting income:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le revenu"
      });
      throw error;
    }
  }

  async executeGetExpenses(): Promise<Expense[]> {
    try {
      const success = await this.ensureInitialized();
      if (!success || !this.db) return [];
      return expenseQueries.getAll(this.db);
    } catch (error) {
      console.error("Error getting expenses:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les dépenses"
      });
      return [];
    }
  }

  async executeAddExpense(expense: Expense): Promise<void> {
    try {
      const success = await this.ensureInitialized();
      if (!success || !this.db) return;
      expenseQueries.add(this.db, expense);
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la dépense"
      });
      throw error;
    }
  }

  async executeUpdateExpense(expense: Expense): Promise<void> {
    try {
      const success = await this.ensureInitialized();
      if (!success || !this.db) return;
      expenseQueries.update(this.db, expense);
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la dépense"
      });
      throw error;
    }
  }

  async executeDeleteExpense(id: string): Promise<void> {
    try {
      const success = await this.ensureInitialized();
      if (!success || !this.db || !id) return;
      expenseQueries.delete(this.db, id);
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
      throw error;
    }
  }

  async executeGetBudgets(): Promise<Budget[]> {
    try {
      const success = await this.ensureInitialized();
      if (!success || !this.db) return [];
      return budgetQueries.getAll(this.db);
    } catch (error) {
      console.error("Error getting budgets:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les budgets"
      });
      return [];
    }
  }

  async executeAddBudget(budget: Budget): Promise<void> {
    try {
      const success = await this.ensureInitialized();
      if (!success || !this.db) return;
      budgetQueries.add(this.db, budget);
    } catch (error) {
      console.error("Error adding budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le budget"
      });
      throw error;
    }
  }

  async executeUpdateBudget(budget: Budget): Promise<void> {
    try {
      const success = await this.ensureInitialized();
      if (!success || !this.db) return;
      budgetQueries.update(this.db, budget);
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le budget"
      });
      throw error;
    }
  }

  async executeDeleteBudget(id: string): Promise<void> {
    try {
      const success = await this.ensureInitialized();
      if (!success || !this.db || !id) return;
      budgetQueries.delete(this.db, id);
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le budget"
      });
      throw error;
    }
  }

  async executeGetCategories(): Promise<Category[]> {
    try {
      const success = await this.ensureInitialized();
      if (!success || !this.db) return [];
      return categoryQueries.getAll(this.db);
    } catch (error) {
      console.error("Error getting categories:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les catégories"
      });
      return [];
    }
  }

  async executeAddCategory(category: Category): Promise<void> {
    try {
      const success = await this.ensureInitialized();
      if (!success || !this.db) return;
      categoryQueries.add(this.db, category);
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la catégorie"
      });
      throw error;
    }
  }

  async executeUpdateCategory(category: Category): Promise<void> {
    try {
      const success = await this.ensureInitialized();
      if (!success || !this.db) return;
      categoryQueries.update(this.db, category);
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la catégorie"
      });
      throw error;
    }
  }

  async executeDeleteCategory(id: string): Promise<void> {
    try {
      const success = await this.ensureInitialized();
      if (!success || !this.db || !id) return;
      categoryQueries.delete(this.db, id);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la catégorie"
      });
      throw error;
    }
  }
}
