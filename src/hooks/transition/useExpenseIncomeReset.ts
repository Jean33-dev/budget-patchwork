
import { db } from "@/services/database";

export const useExpenseIncomeReset = () => {
  const resetNonRecurringExpenses = async () => {
    // Récupérer toutes les dépenses et filtrer pour ne pas supprimer les récurrentes
    const expenses = await db.getExpenses();
    console.log(`Traitement de ${expenses.length} dépenses pour la transition`);
    
    // Filtrer pour ne garder que les dépenses non récurrentes à supprimer
    const nonRecurringExpenses = expenses.filter(expense => !expense.isRecurring);
    console.log(`Suppression de ${nonRecurringExpenses.length} dépenses non récurrentes`);
    
    // Supprimer uniquement les dépenses non récurrentes
    await Promise.all(
      nonRecurringExpenses.map(expense => db.deleteExpense(expense.id))
    );
    
    return {
      total: expenses.length,
      deleted: nonRecurringExpenses.length,
      remaining: expenses.length - nonRecurringExpenses.length
    };
  };
  
  const resetNonRecurringIncomes = async () => {
    // Récupérer tous les revenus et filtrer pour ne pas supprimer les récurrents
    const incomes = await db.getIncomes();
    console.log(`Traitement de ${incomes.length} revenus pour la transition`);
    
    // Filtrer pour ne garder que les revenus non récurrents à supprimer
    const nonRecurringIncomes = incomes.filter(income => !income.isRecurring);
    console.log(`Suppression de ${nonRecurringIncomes.length} revenus non récurrents`);
    
    // Supprimer uniquement les revenus non récurrents
    await Promise.all(
      nonRecurringIncomes.map(income => db.deleteIncome(income.id))
    );
    
    return {
      total: incomes.length,
      deleted: nonRecurringIncomes.length,
      remaining: incomes.length - nonRecurringIncomes.length
    };
  };
  
  const resetCategorySpent = async (categories: any[]) => {
    const updatedCategories = [...categories];
    
    for (let category of updatedCategories) {
      // Réinitialiser le montant dépensé à 0 puisque toutes les dépenses non récurrentes ont été supprimées
      category.spent = 0;
      await db.updateCategory(category);
      console.log(`Catégorie ${category.name} mise à jour, dépenses réinitialisées à 0`);
    }
    
    return updatedCategories;
  };

  return {
    resetNonRecurringExpenses,
    resetNonRecurringIncomes,
    resetCategorySpent
  };
};
