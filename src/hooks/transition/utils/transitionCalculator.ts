import { toast } from "@/components/ui/use-toast";
import { TransitionEnvelope } from "@/types/transition";
import { db } from "@/services/database";

/**
 * Précalcule tous les montants à reporter avant de faire des modifications
 */
export const calculateTransitionAmounts = async (envelopes: TransitionEnvelope[], dashboardId: string) => {
  console.log(`[LOG] 🔄 Début du pré-calcul des montants de transition pour le dashboard: ${dashboardId}`);
  console.log(`[LOG] 🔄 Nombre d'enveloppes à traiter: ${envelopes.length}`);
  
  // Récupérer tous les budgets du dashboard
  const allBudgets = await db.getBudgets();
  console.log(`[LOG] 📊 Total de budgets dans la base: ${allBudgets.length}`);
  
  const dashboardBudgets = allBudgets.filter(budget => 
    String(budget.dashboardId || '') === String(dashboardId || '')
  );
  console.log(`[LOG] 📊 Budgets filtrés pour le dashboard ${dashboardId}: ${dashboardBudgets.length}`);
  
  // Structure pour stocker les résultats pré-calculés
  const transitionPlan = new Map();
  
  // Récupérer les dépenses actuelles pour analyse
  const allExpenses = await db.getExpenses();
  console.log(`[LOG] 📊 Total de dépenses dans la base: ${allExpenses.length}`);
  
  const dashboardExpenses = allExpenses.filter(expense => 
    String(expense.dashboardId || '') === String(dashboardId || '')
  );
  console.log(`[LOG] 📊 Dépenses filtrées pour le dashboard ${dashboardId}: ${dashboardExpenses.length}`);
  
  // Calculer pour chaque enveloppe
  for (const envelope of envelopes) {
    console.log(`\n[LOG] 📋 Analyse de l'enveloppe ${envelope.id} (${envelope.title})`);
    
    const budgetToProcess = dashboardBudgets.find(b => b.id === envelope.id);
    if (!budgetToProcess) {
      console.log(`[LOG] ⚠️ Budget ${envelope.id} (${envelope.title}) non trouvé dans le dashboard`);
      continue;
    }
    
    console.log(`[LOG] 📋 Budget trouvé: ${budgetToProcess.title} (ID: ${budgetToProcess.id})`);
    console.log(`[LOG] 💰 Montant initial du budget: ${budgetToProcess.budget}`);
    console.log(`[LOG] 💰 Report précédent: ${budgetToProcess.carriedOver || 0}`);
    console.log(`[LOG] 💰 Montant dépensé: ${budgetToProcess.spent}`);
    
    // Vérifier si ce budget a des dépenses associées
    const budgetExpenses = dashboardExpenses.filter(expense => expense.linkedBudgetId === budgetToProcess.id);
    const totalExpenseAmount = budgetExpenses.reduce((sum, expense) => sum + expense.budget, 0);
    
    console.log(`[LOG] 📊 Nombre de dépenses associées: ${budgetExpenses.length}`);
    console.log(`[LOG] 📊 Détail des dépenses associées:`);
    budgetExpenses.forEach((expense, index) => {
      console.log(`[LOG] 📊 - Dépense #${index+1}: id=${expense.id}, titre=${expense.title}, montant=${expense.budget}, date=${expense.date}`);
    });
    console.log(`[LOG] 💰 Total des dépenses associées: ${totalExpenseAmount}`);
    
    // *** CALCUL DU MONTANT RESTANT ***
    // Formule: (budget + carriedOver) - spent
    const totalBudget = budgetToProcess.budget + (budgetToProcess.carriedOver || 0);
    const remainingAmount = totalBudget - budgetToProcess.spent;
    
    console.log(`[LOG] 🧮 CALCUL DU MONTANT RESTANT:`);
    console.log(`[LOG] 🧮 Budget initial (${budgetToProcess.budget}) + Report précédent (${budgetToProcess.carriedOver || 0}) = Total disponible (${totalBudget})`);
    console.log(`[LOG] 🧮 Total disponible (${totalBudget}) - Montant dépensé (${budgetToProcess.spent}) = Montant restant (${remainingAmount})`);
    
    if (budgetToProcess.spent !== totalExpenseAmount) {
      console.log(`[LOG] ⚠️ DIFFÉRENCE DÉTECTÉE: budget.spent (${budgetToProcess.spent}) ≠ somme des dépenses (${totalExpenseAmount})`);
      console.log(`[LOG] ⚠️ Cette différence pourrait causer des problèmes dans les calculs`);
      console.log(`[LOG] 🔍 ANALYSE DE LA DIFFÉRENCE: ${Math.abs(budgetToProcess.spent - totalExpenseAmount)} (${budgetToProcess.spent > totalExpenseAmount ? 'surévaluation' : 'sous-évaluation'} du spent)`);
      
      // Déterminer quelle valeur utiliser pour le calcul
      const calculatedAmount = totalBudget - totalExpenseAmount;
      console.log(`[LOG] 🧮 Calcul alternatif avec les dépenses réelles: ${totalBudget} - ${totalExpenseAmount} = ${calculatedAmount}`);
    }
    
    console.log(`[LOG] 🔄 Option de transition choisie: ${envelope.transitionOption}`);
    
    // Stocker ce montant et l'option pour utilisation ultérieure
    transitionPlan.set(envelope.id, {
      budgetId: envelope.id,
      title: budgetToProcess.title,
      initialBudget: budgetToProcess.budget,
      previousCarriedOver: budgetToProcess.carriedOver || 0,
      spent: budgetToProcess.spent,
      expensesTotal: totalExpenseAmount,
      // reporter le montant négatif si c'est le cas
      remainingAmount: remainingAmount,
      option: envelope.transitionOption,
      transferTargetId: envelope.transferTargetId,
      multiTransfers: envelope.multiTransfers
    });
    
    console.log(`[LOG] ✅ Plan de transition créé pour ${budgetToProcess.title}: montant à reporter = ${remainingAmount}`);
  }
  
  console.log(`[LOG] 📝 RÉCAPITULATIF DU PLAN DE TRANSITION:`);
  for (const [id, plan] of transitionPlan.entries()) {
    console.log(`[LOG] 📝 Budget ${id} (${plan.title}):`);
    console.log(`[LOG] 📝 - Montant restant à reporter: ${plan.remainingAmount}`);
    console.log(`[LOG] 📝 - Option de transition: ${plan.option}`);
    console.log(`[LOG] 📝 - Différence budget.spent vs total dépenses: ${plan.spent} vs ${plan.expensesTotal} = ${plan.spent - plan.expensesTotal}`);
  }
  
  return transitionPlan;
};
