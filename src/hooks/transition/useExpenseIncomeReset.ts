
import { db } from "@/services/database";

export const useExpenseIncomeReset = () => {
  const resetNonRecurringExpenses = async (dashboardId: string) => {
    // Récupérer toutes les dépenses et filtrer pour ne pas supprimer les récurrentes
    const expenses = await db.getExpenses();
    console.log(`Réinitialisation - Traitement de ${expenses.length} dépenses pour la transition`);
    
    // Filtrer pour ne garder que les dépenses non récurrentes du dashboard courant à supprimer
    const nonRecurringExpenses = expenses.filter(expense => 
      !expense.isRecurring && 
      String(expense.dashboardId) === String(dashboardId)
    );
    
    console.log(`Réinitialisation - Suppression de ${nonRecurringExpenses.length} dépenses non récurrentes du dashboard ${dashboardId}`);
    
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
  
  const resetNonRecurringIncomes = async (dashboardId: string) => {
    // Récupérer tous les revenus et filtrer pour ne pas supprimer les récurrents
    const incomes = await db.getIncomes();
    console.log(`Réinitialisation - Traitement de ${incomes.length} revenus pour la transition`);
    
    // Filtrer pour ne garder que les revenus non récurrents du dashboard courant à supprimer
    const nonRecurringIncomes = incomes.filter(income => 
      !income.isRecurring && 
      String(income.dashboardId) === String(dashboardId)
    );
    
    console.log(`Réinitialisation - Suppression de ${nonRecurringIncomes.length} revenus non récurrents du dashboard ${dashboardId}`);
    
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
  
  const resetCategorySpent = async (categories: any[], dashboardId: string) => {
    // Filtrer les catégories pour ne réinitialiser que celles du dashboard courant
    const dashboardCategories = [...categories].filter(category => 
      category.dashboardId === dashboardId || !category.dashboardId
    );
    
    console.log(`Réinitialisation - Remise à zéro des dépenses des catégories pour le dashboard ${dashboardId}`);
    
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
