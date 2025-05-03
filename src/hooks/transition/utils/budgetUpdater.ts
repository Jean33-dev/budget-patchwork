
import { toast } from "@/components/ui/use-toast";
import { Budget } from "@/services/database/models/budget";
import { db } from "@/services/database";

/**
 * Met à jour le montant dépensé (spent) d'un budget
 */
export const updateBudgetSpent = async (budgetId: string, newSpentValue: number) => {
  try {
    console.log(`[LOG] 🔄 updateBudgetSpent - Mise à jour du spent pour budget ID ${budgetId} vers ${newSpentValue}`);
    
    const budget = await db.getBudgets()
      .then(budgets => budgets.find(b => b.id === budgetId));
    
    if (!budget) {
      console.log(`[LOG] ❌ updateBudgetSpent - Budget avec ID ${budgetId} non trouvé`);
      return;
    }
    
    console.log(`[LOG] 🔄 updateBudgetSpent - Budget trouvé: ${budget.title}, spent actuel: ${budget.spent}`);
    
    // Journaliser l'objet budget avant mise à jour
    console.log(`[LOG] 🔍 updateBudgetSpent - Objet budget AVANT mise à jour:`, JSON.stringify(budget, null, 2));
    
    // Vérifier si des dépenses sont associées à ce budget
    const expenses = await db.getExpenses();
    const linkedExpenses = expenses.filter(expense => expense.linkedBudgetId === budgetId);
    const totalExpenseAmount = linkedExpenses.reduce((sum, expense) => sum + expense.budget, 0);
    
    console.log(`[LOG] 🔍 updateBudgetSpent - Dépenses associées: ${linkedExpenses.length} dépenses pour un total de ${totalExpenseAmount}`);
    console.log(`[LOG] 🔍 updateBudgetSpent - Valeur actuellement en DB: ${budget.spent}, nouvelle valeur à définir: ${newSpentValue}, somme réelle des dépenses: ${totalExpenseAmount}`);
    
    // Créer un nouveau budget avec le spent mis à jour
    const updatedBudget = {
      ...budget,
      spent: newSpentValue
    };
    
    console.log(`[LOG] 🔍 updateBudgetSpent - Objet budget APRÈS préparation de mise à jour:`, JSON.stringify(updatedBudget, null, 2));
    
    // Effectuer la mise à jour
    await db.updateBudget(updatedBudget);
    console.log(`[LOG] 🔄 updateBudgetSpent - db.updateBudget appelé`);
    
    // Vérifier après mise à jour
    const verifyBudget = await db.getBudgets()
      .then(budgets => budgets.find(b => b.id === budgetId));
    
    if (!verifyBudget) {
      console.log(`[LOG] ❌ updateBudgetSpent - Impossible de vérifier la mise à jour: budget non trouvé après mise à jour`);
      return;
    }
    
    console.log(`[LOG] 🔍 updateBudgetSpent - Vérification après mise à jour: spent = ${verifyBudget.spent}`);
    
    if (verifyBudget.spent !== newSpentValue) {
      console.log(`[LOG] ❌ updateBudgetSpent - ERREUR: La mise à jour de spent n'a pas fonctionné correctement (${verifyBudget.spent} ≠ ${newSpentValue})`);
    } else {
      console.log(`[LOG] ✅ updateBudgetSpent - Mise à jour réussie de spent pour ${budget.title}`);
    }
  } catch (error) {
    console.error(`[LOG] ❌ updateBudgetSpent - Erreur lors de la mise à jour du budget ${budgetId}:`, error);
    throw error;
  }
};

/**
 * Met à jour le montant reporté (carriedOver) d'un budget
 */
export const updateBudgetCarriedOver = async (budgetId: string, carriedOverAmount: number) => {
  try {
    console.log(`[LOG] 🔄 updateBudgetCarriedOver - Début mise à jour carriedOver pour budget ID ${budgetId}`);
    console.log(`[LOG] 🔄 updateBudgetCarriedOver - Valeur à définir: ${carriedOverAmount}, type: ${typeof carriedOverAmount}`);
    
    const budget = await db.getBudgets()
      .then(budgets => budgets.find(b => b.id === budgetId));
    
    if (!budget) {
      console.log(`[LOG] ❌ updateBudgetCarriedOver - Budget avec ID ${budgetId} non trouvé`);
      return;
    }
    
    console.log(`[LOG] 🔄 updateBudgetCarriedOver - Budget trouvé: ${budget.title}, carriedOver actuel: ${budget.carriedOver || 0}`);
    
    // Journaliser l'objet budget avant mise à jour
    console.log(`[LOG] 🔍 updateBudgetCarriedOver - Objet budget AVANT mise à jour:`, JSON.stringify(budget, null, 2));
    console.log(`[LOG] 🔍 updateBudgetCarriedOver - Type de carriedOverAmount: ${typeof carriedOverAmount}, Valeur: ${carriedOverAmount}`);
    
    // Vérification supplémentaire pour s'assurer que carriedOverAmount est un nombre
    if (typeof carriedOverAmount !== 'number' || isNaN(carriedOverAmount)) {
      console.log(`[LOG] ⚠️ updateBudgetCarriedOver - ATTENTION: carriedOverAmount n'est pas un nombre valide: ${carriedOverAmount}`);
      carriedOverAmount = 0; // Valeur par défaut en cas d'erreur
    }
    
    // Créer un nouveau budget avec le carriedOver mis à jour
    const updatedBudget = {
      ...budget,
      carriedOver: carriedOverAmount
    };
    
    console.log(`[LOG] 🔍 updateBudgetCarriedOver - Objet budget APRÈS préparation de mise à jour:`, JSON.stringify(updatedBudget, null, 2));
    
    // Effectuer la mise à jour
    console.log(`[LOG] 🔄 updateBudgetCarriedOver - APPEL db.updateBudget avec carriedOver = ${carriedOverAmount}`);
    await db.updateBudget(updatedBudget);
    console.log(`[LOG] 🔄 updateBudgetCarriedOver - db.updateBudget appelé et résolu`);
    
    // Vérifier après mise à jour
    const verifyBudget = await db.getBudgets()
      .then(budgets => budgets.find(b => b.id === budgetId));
    
    if (!verifyBudget) {
      console.log(`[LOG] ❌ updateBudgetCarriedOver - Impossible de vérifier la mise à jour: budget non trouvé après mise à jour`);
      return;
    }
    
    console.log(`[LOG] 🔍 updateBudgetCarriedOver - Vérification après mise à jour: carriedOver = ${verifyBudget.carriedOver}, type = ${typeof verifyBudget.carriedOver}`);
    
    // Vérification très détaillée pour debug
    console.log(`[LOG] 🔬 INSPECTION DÉTAILLÉE:`);
    console.log(`[LOG] 🔬 - Type original envoyé: ${typeof carriedOverAmount}`);
    console.log(`[LOG] 🔬 - Valeur originale envoyée: ${carriedOverAmount}`);
    console.log(`[LOG] 🔬 - Type stocké en DB: ${typeof verifyBudget.carriedOver}`);
    console.log(`[LOG] 🔬 - Valeur stockée en DB: ${verifyBudget.carriedOver}`);
    console.log(`[LOG] 🔬 - Égalité stricte: ${verifyBudget.carriedOver === carriedOverAmount}`);
    console.log(`[LOG] 🔬 - Égalité avec conversion: ${Number(verifyBudget.carriedOver) === Number(carriedOverAmount)}`);
    console.log(`[LOG] 🔬 - Différence numérique: ${Number(verifyBudget.carriedOver) - Number(carriedOverAmount)}`);
    
    if (verifyBudget.carriedOver !== carriedOverAmount) {
      console.log(`[LOG] ❌ updateBudgetCarriedOver - ERREUR: La mise à jour de carriedOver n'a pas fonctionné correctement (${verifyBudget.carriedOver} ≠ ${carriedOverAmount})`);
    } else {
      console.log(`[LOG] ✅ updateBudgetCarriedOver - Mise à jour réussie de carriedOver pour ${budget.title}`);
    }
  } catch (error) {
    console.error(`[LOG] ❌ updateBudgetCarriedOver - Erreur lors de la mise à jour du montant reporté pour le budget ${budgetId}:`, error);
    throw error;
  }
};
