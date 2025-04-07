
import { db } from "@/services/database";
import { Expense } from "@/services/database/models/expense";
import { Income } from "@/services/database/models/income";
import { FixedExpense } from "@/services/database/models/fixedExpense";
import { FixedIncome } from "@/services/database/models/fixedIncome";

export const fixedTransactionOperations = {
  /**
   * Enregistre une dépense comme fixe
   */
  async saveFixedExpense(expense: Expense): Promise<boolean> {
    try {
      console.log("Enregistrement d'une dépense fixe:", expense);
      
      // Créer l'objet de dépense fixe à partir de l'expense
      const fixedExpense: FixedExpense = {
        id: expense.id,
        title: expense.title,
        budget: expense.budget,
        type: "expense",
        linkedBudgetId: expense.linkedBudgetId,
        date: expense.date
      };
      
      // Ajouter à la table des dépenses fixes
      await db.addFixedExpense(fixedExpense);
      console.log("Dépense fixe enregistrée avec succès");
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la dépense fixe:", error);
      return false;
    }
  },
  
  /**
   * Enregistre un revenu comme fixe
   */
  async saveFixedIncome(income: Income): Promise<boolean> {
    try {
      console.log("Enregistrement d'un revenu fixe:", income);
      
      // Créer l'objet de revenu fixe à partir de l'income
      const fixedIncome: FixedIncome = {
        id: income.id,
        title: income.title,
        budget: income.budget,
        type: "income",
        date: income.date
      };
      
      // Ajouter à la table des revenus fixes
      await db.addFixedIncome(fixedIncome);
      console.log("Revenu fixe enregistré avec succès");
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du revenu fixe:", error);
      return false;
    }
  },
  
  /**
   * Supprime une dépense fixe
   */
  async deleteFixedExpense(id: string): Promise<boolean> {
    try {
      await db.deleteFixedExpense(id);
      console.log("Dépense fixe supprimée avec succès:", id);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense fixe:", error);
      return false;
    }
  },
  
  /**
   * Supprime un revenu fixe
   */
  async deleteFixedIncome(id: string): Promise<boolean> {
    try {
      await db.deleteFixedIncome(id);
      console.log("Revenu fixe supprimé avec succès:", id);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du revenu fixe:", error);
      return false;
    }
  },
  
  /**
   * Met à jour les dates de toutes les dépenses et revenus fixes pour le mois suivant
   */
  async updateFixedTransactionsDates(): Promise<boolean> {
    try {
      // Calculer la date du mois suivant
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      const nextMonthDateString = nextMonth.toISOString().split('T')[0];
      
      console.log(`Mise à jour des dates des transactions fixes vers: ${nextMonthDateString}`);
      
      // Mettre à jour les dates
      await db.updateFixedExpensesDates(nextMonthDateString);
      await db.updateFixedIncomesDates(nextMonthDateString);
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour des dates des transactions fixes:", error);
      return false;
    }
  },
  
  /**
   * Récupère toutes les dépenses fixes et les prépare pour importation
   */
  async getFixedExpensesForImport(): Promise<Expense[]> {
    try {
      const fixedExpenses = await db.getFixedExpenses();
      
      // Convertir les dépenses fixes en dépenses standard
      return fixedExpenses.map(fixedExp => ({
        id: Date.now() + "-" + Math.random().toString(36).substr(2, 9), // Nouveau ID unique
        title: fixedExp.title,
        budget: fixedExp.budget,
        spent: fixedExp.budget, // Initialiser spent au montant du budget
        type: "expense",
        linkedBudgetId: fixedExp.linkedBudgetId,
        date: fixedExp.date,
        isFixed: true
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses fixes pour importation:", error);
      return [];
    }
  },
  
  /**
   * Récupère tous les revenus fixes et les prépare pour importation
   */
  async getFixedIncomesForImport(): Promise<Income[]> {
    try {
      const fixedIncomes = await db.getFixedIncomes();
      
      // Convertir les revenus fixes en revenus standard
      return fixedIncomes.map(fixedInc => ({
        id: Date.now() + "-" + Math.random().toString(36).substr(2, 9), // Nouveau ID unique
        title: fixedInc.title,
        budget: fixedInc.budget,
        spent: fixedInc.budget, // Initialiser spent au montant du budget
        type: "income",
        date: fixedInc.date,
        isFixed: true
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des revenus fixes pour importation:", error);
      return [];
    }
  }
};
