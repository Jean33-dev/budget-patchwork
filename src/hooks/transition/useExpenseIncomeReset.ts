
import { db } from "@/services/database";

export const useExpenseIncomeReset = () => {
  /**
   * Réinitialise les dépenses non récurrentes pour un dashboard spécifique
   */
  const resetNonRecurringExpenses = async (dashboardId: string) => {
    // Récupérer toutes les dépenses pour effectuer le filtrage
    const expenses = await db.getExpenses();
    console.log(`Réinitialisation - Traitement de ${expenses.length} dépenses pour la transition`);
    
    // Log pour débogage: vérifier les dashboardIds de toutes les dépenses
    const dashboardIds = [...new Set(expenses.map(expense => expense.dashboardId))];
    console.log(`Réinitialisation - DashboardIds présents dans les dépenses: ${JSON.stringify(dashboardIds)}`);
    
    // Filtrer pour ne garder que les dépenses non récurrentes du dashboard courant à supprimer
    const nonRecurringExpenses = expenses.filter(expense => 
      !expense.isRecurring && 
      String(expense.dashboardId || '') === String(dashboardId || '')
    );
    
    console.log(`Réinitialisation - Suppression de ${nonRecurringExpenses.length} dépenses non récurrentes du dashboard ${dashboardId}`);
    
    // Vérifier et afficher les détails des dépenses à supprimer (pour débogage)
    if (nonRecurringExpenses.length > 0) {
      console.log("Détails des premières dépenses à supprimer:", 
        nonRecurringExpenses.slice(0, 3).map(e => ({
          id: e.id,
          title: e.title,
          isRecurring: e.isRecurring,
          dashboardId: e.dashboardId,
          linkedBudgetId: e.linkedBudgetId
        }))
      );
    }
    
    // Supprimer uniquement les dépenses non récurrentes du dashboard courant
    await Promise.all(
      nonRecurringExpenses.map(expense => db.deleteExpense(expense.id))
    );
    
    return {
      total: expenses.length,
      deleted: nonRecurringExpenses.length,
      remaining: expenses.length - nonRecurringExpenses.length
    };
  };
  
  /**
   * Réinitialise les revenus non récurrents pour un dashboard spécifique
   */
  const resetNonRecurringIncomes = async (dashboardId: string) => {
    // Récupérer tous les revenus pour effectuer le filtrage
    const incomes = await db.getIncomes();
    console.log(`Réinitialisation - Traitement de ${incomes.length} revenus pour la transition`);
    
    // Log pour débogage: vérifier les dashboardIds de tous les revenus
    const dashboardIds = [...new Set(incomes.map(income => income.dashboardId))];
    console.log(`Réinitialisation - DashboardIds présents dans les revenus: ${JSON.stringify(dashboardIds)}`);
    
    // Filtrer pour ne garder que les revenus non récurrents du dashboard courant à supprimer
    const nonRecurringIncomes = incomes.filter(income => 
      !income.isRecurring && 
      String(income.dashboardId) === String(dashboardId)
    );
    
    console.log(`Réinitialisation - Suppression de ${nonRecurringIncomes.length} revenus non récurrents du dashboard ${dashboardId}`);
    
    // Vérifier et afficher les détails des revenus à supprimer (pour débogage)
    if (nonRecurringIncomes.length > 0) {
      console.log("Détails des premiers revenus à supprimer:", 
        nonRecurringIncomes.slice(0, 3).map(i => ({
          id: i.id,
          title: i.title,
          isRecurring: i.isRecurring,
          dashboardId: i.dashboardId
        }))
      );
    }
    
    // Supprimer uniquement les revenus non récurrents du dashboard courant
    await Promise.all(
      nonRecurringIncomes.map(income => db.deleteIncome(income.id))
    );
    
    return {
      total: incomes.length,
      deleted: nonRecurringIncomes.length,
      remaining: incomes.length - nonRecurringIncomes.length
    };
  };
  
  /**
   * Réinitialise les montants dépensés dans les catégories
   * Cette fonction doit être appelée APRÈS que les reports ont été calculés et enregistrés
   */
  const resetCategorySpent = async (categories: any[], dashboardId: string) => {
    // Filtrer les catégories pour ne réinitialiser que celles du dashboard courant
    const dashboardCategories = [...categories].filter(category => 
      category.dashboardId === dashboardId || !category.dashboardId
    );
    
    console.log(`Réinitialisation - Remise à zéro des dépenses des catégories pour le dashboard ${dashboardId}`);
    console.log(`Réinitialisation - Nombre de catégories à traiter: ${dashboardCategories.length}`);
    
    // Vérifier les budgets après application des transitions pour le débogage
    const budgetsAfterTransition = await db.getBudgets();
    const dashboardBudgets = budgetsAfterTransition.filter(b => 
      String(b.dashboardId || '') === String(dashboardId || '')
    );
    
    console.log("État des budgets après application des transitions et avant réinitialisation des catégories:");
    for (const budget of dashboardBudgets) {
      console.log(`Budget ${budget.title}: budget=${budget.budget}, carriedOver=${budget.carriedOver || 0}, spent=${budget.spent}`);
    }
    
    for (let category of dashboardCategories) {
      // Stocker l'ancien montant pour le log
      const oldSpent = category.spent || 0;
      
      // Réinitialiser le montant dépensé à 0 puisque toutes les dépenses non récurrentes ont été supprimées
      category.spent = 0;
      await db.updateCategory(category);
      console.log(`Réinitialisation - Catégorie ${category.name} mise à jour, dépenses réinitialisées: ${oldSpent} -> 0`);
    }
    
    return dashboardCategories;
  };

  return {
    resetNonRecurringExpenses,
    resetNonRecurringIncomes,
    resetCategorySpent
  };
};
