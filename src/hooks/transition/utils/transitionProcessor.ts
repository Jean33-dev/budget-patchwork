import { toast } from "@/components/ui/use-toast";
import { TransitionEnvelope } from "@/types/transition";
import { db } from "@/services/database";
import { calculateTransitionAmounts } from "./transitionCalculator";
import { updateBudgetSpent, updateBudgetCarriedOver } from "./budgetUpdater";
import { transferBudget, processMultiTransfers } from "./transferOperations";

/**
 * Traite les transitions pour toutes les enveloppes budgétaires
 */
export const processEnvelopeTransitions = async (envelopes: TransitionEnvelope[], dashboardId: string) => {
  console.log(`\n[LOG] 🚀 DÉBUT DE LA TRANSITION DES ENVELOPPES pour le dashboard: ${dashboardId}`);
  console.log(`[LOG] 🚀 ${envelopes.length} enveloppes à traiter`);
  
  // 1. PRÉ-CALCUL des montants à reporter AVANT toute modification
  console.log(`\n[LOG] 📊 ÉTAPE 1: PRÉ-CALCUL des montants avant modifications`);
  const transitionPlan = await calculateTransitionAmounts(envelopes, dashboardId);
  
  // 2. Récupérer tous les budgets du dashboard pour appliquer les modifications
  console.log(`\n[LOG] 📊 ÉTAPE 2: Récupération des budgets pour appliquer les modifications`);
  const allBudgets = await db.getBudgets();
  const dashboardBudgets = allBudgets.filter(budget => 
    String(budget.dashboardId || '') === String(dashboardId || '')
  );
  console.log(`[LOG] 📊 ${dashboardBudgets.length} budgets trouvés pour le dashboard ${dashboardId}`);
  
  // 3. Récupérer aussi toutes les dépenses récurrentes pour référence
  console.log(`\n[LOG] 📊 ÉTAPE 3: Récupération des dépenses récurrentes pour référence`);
  const allExpenses = await db.getExpenses();
  const recurringExpenses = allExpenses.filter(expense => 
    expense.isRecurring && String(expense.dashboardId || '') === String(dashboardId || '')
  );
  console.log(`[LOG] 📊 ${recurringExpenses.length} dépenses récurrentes trouvées pour le dashboard ${dashboardId}`);
  
  // 4. Appliquer les transitions selon le plan pré-calculé
  console.log(`\n[LOG] 🔄 ÉTAPE 4: Application des transitions selon le plan`);
  
  for (const envelope of envelopes) {
    console.log(`\n[LOG] 📋 Traitement de l'enveloppe ${envelope.id} (${envelope.title})`);
    
    // Vérifier que l'enveloppe appartient au dashboard courant
    const budgetToProcess = dashboardBudgets.find(b => b.id === envelope.id);
    if (!budgetToProcess) {
      console.log(`[LOG] ⚠️ Budget ${envelope.id} ignoré car il n'appartient pas au dashboard ${dashboardId}`);
      continue;
    }
    
    // Récupérer les valeurs pré-calculées
    const transitionInfo = transitionPlan.get(envelope.id);
    if (!transitionInfo) {
      console.log(`[LOG] ⚠️ Pas d'information de transition pour le budget ${envelope.id}`);
      continue;
    }
    
    const { remainingAmount } = transitionInfo;
    
    console.log(`[LOG] 📊 État actuel du budget:`);
    console.log(`[LOG] 📊 - budget = ${budgetToProcess.budget}`);
    console.log(`[LOG] 📊 - carriedOver = ${budgetToProcess.carriedOver || 0}`);
    console.log(`[LOG] 📊 - spent = ${budgetToProcess.spent}`);
    console.log(`[LOG] 📊 - Montant restant calculé = ${remainingAmount}`);
    console.log(`[LOG] 🔄 Option de transition: ${envelope.transitionOption}`);
    
    try {
      // Vérifier si ce budget a des dépenses récurrentes associées
      const linkedRecurringExpenses = recurringExpenses.filter(
        expense => expense.linkedBudgetId === budgetToProcess.id
      );
      
      if (linkedRecurringExpenses.length > 0) {
        console.log(`[LOG] 📋 Budget ${envelope.title} a ${linkedRecurringExpenses.length} dépenses récurrentes associées`);
      }
      
      switch (envelope.transitionOption) {
        case "keep":
          console.log(`[LOG] ✅ Budget ${envelope.title} conservé tel quel (aucune modification)`);
          break;
        
        case "reset":
          console.log(`[LOG] 🔄 Reset du budget ${envelope.title}...`);
          console.log(`[LOG] 🔄 - Mise à jour de spent: ${budgetToProcess.spent} -> 0`);
          await updateBudgetSpent(envelope.id, 0);
          
          console.log(`[LOG] 🔄 - Mise à jour de carriedOver: ${budgetToProcess.carriedOver || 0} -> 0`);
          await updateBudgetCarriedOver(envelope.id, 0);
          
          console.log(`[LOG] ✅ Reset terminé pour ${envelope.title}`);
          break;
        
        case "carry":
          console.log(`[LOG] 🔄 Report du montant restant pour ${envelope.title}...`);
          // Maintenant, reporter TOUJOURS le montant réel (même s'il est négatif)
          console.log(`[LOG] 🔄 - Montant à reporter (positif ou négatif): ${remainingAmount}`);
          console.log(`[LOG] 🔄 - Ancien carriedOver: ${budgetToProcess.carriedOver || 0}`);
          console.log(`[LOG] 🔄 - Nouveau carriedOver à définir: ${remainingAmount}`);
          // IMPORTANT: Log avant la mise à jour
          console.log(`[LOG] 🔍 AVANT updateBudgetCarriedOver - Budget ID: ${envelope.id}, Nouveau montant: ${remainingAmount}`);
          await updateBudgetCarriedOver(envelope.id, remainingAmount);
          // IMPORTANT: Log après la mise à jour
          const budgetAfterCarry = await db.getBudgets().then(budgets => budgets.find(b => b.id === envelope.id));
          if (budgetAfterCarry) {
            console.log(`[LOG] 🔍 APRÈS updateBudgetCarriedOver - Budget ID: ${envelope.id}, carriedOver actuel: ${budgetAfterCarry.carriedOver}`);
            if (budgetAfterCarry.carriedOver !== remainingAmount) {
              console.log(`[LOG] ❌ ERREUR: La mise à jour de carriedOver a échoué! Valeur attendue: ${remainingAmount}, Valeur actuelle: ${budgetAfterCarry.carriedOver}`);
            } else {
              console.log(`[LOG] ✅ La mise à jour de carriedOver a réussi.`);
            }
          }
          // Réinitialiser le 'spent'
          console.log(`[LOG] 🔄 Réinitialisation de spent à 0`);
          await updateBudgetSpent(envelope.id, 0);
          console.log(`[LOG] ✅ Report terminé pour ${envelope.title}`);
          break;
        
        case "transfer":
          console.log(`[LOG] 🔄 Transfert pour ${envelope.title}...`);
          if (envelope.transferTargetId && remainingAmount > 0) {
            console.log(`[LOG] 🔄 - Cible du transfert: ${envelope.transferTargetId}`);
            console.log(`[LOG] 🔄 - Montant à transférer: ${remainingAmount}`);
            
            await transferBudget(
              envelope.id, 
              envelope.transferTargetId, 
              remainingAmount,
              dashboardId
            );
            console.log(`[LOG] ✅ Transfert terminé de ${envelope.title} vers ${envelope.transferTargetId}`);
          } else if (remainingAmount <= 0) {
            console.log(`[LOG] 🔄 Rien à transférer (montant restant ≤ 0)`);
            // Réinitialiser quand même le spent
            console.log(`[LOG] 🔄 - Réinitialisation de spent à 0`);
            await updateBudgetSpent(envelope.id, 0);
            // Et mettre carriedOver à 0
            console.log(`[LOG] 🔄 - Mise à jour de carriedOver à 0`);
            await updateBudgetCarriedOver(envelope.id, 0);
            console.log(`[LOG] ✅ Réinitialisation terminée pour ${envelope.title}`);
          } else {
            console.log(`[LOG] ⚠️ Cible de transfert non définie pour ${envelope.title}`);
          }
          break;
        
        case "multi-transfer":
          console.log(`[LOG] 🔄 Transferts multiples pour ${envelope.title}...`);
          if (envelope.multiTransfers && envelope.multiTransfers.length > 0 && remainingAmount > 0) {
            console.log(`[LOG] 🔄 - Nombre de cibles: ${envelope.multiTransfers.length}`);
            console.log(`[LOG] 🔄 - Montant total à transférer: ${remainingAmount}`);
            
            await processMultiTransfers(
              envelope.id, 
              envelope.multiTransfers, 
              remainingAmount,
              dashboardId
            );
            console.log(`[LOG] ✅ Transferts multiples terminés pour ${envelope.title}`);
          } else if (remainingAmount <= 0) {
            console.log(`[LOG] 🔄 Rien à transférer en multi (montant restant ≤ 0)`);
            // Réinitialiser quand même le spent
            console.log(`[LOG] 🔄 - Réinitialisation de spent à 0`);
            await updateBudgetSpent(envelope.id, 0);
            // Et mettre carriedOver à 0
            console.log(`[LOG] 🔄 - Mise à jour de carriedOver à 0`);
            await updateBudgetCarriedOver(envelope.id, 0);
            console.log(`[LOG] ✅ Réinitialisation terminée pour ${envelope.title}`);
          } else {
            console.log(`[LOG] ⚠️ Aucune cible de transfert multiple définie pour ${envelope.title}`);
          }
          break;
          
        default:
          console.log(`[LOG] ⚠️ Option de transition non reconnue pour ${envelope.title}: ${envelope.transitionOption}`);
      }
      
      // Vérifier l'état final après traitement
      const updatedBudget = await db.getBudgets()
        .then(budgets => budgets.find(b => b.id === envelope.id));
      if (updatedBudget) {
        console.log(`[LOG] 📊 État final du budget ${envelope.title}:`);
        console.log(`[LOG] 📊 - budget = ${updatedBudget.budget}`);
        console.log(`[LOG] 📊 - carriedOver = ${updatedBudget.carriedOver || 0}`);
        console.log(`[LOG] 📊 - spent = ${updatedBudget.spent}`);
        
        // Vérification spécifique pour l'option "carry"
        if (envelope.transitionOption === "carry" && remainingAmount > 0) {
          if (updatedBudget.carriedOver !== remainingAmount) {
            console.log(`[LOG] ❌ ERREUR: Le montant reporté final (${updatedBudget.carriedOver}) ne correspond pas au montant calculé (${remainingAmount})!`);
          } else {
            console.log(`[LOG] ✅ Le montant reporté correspond bien au montant calculé.`);
          }
        }
      }
    } catch (error) {
      console.error(`[LOG] ❌ ERREUR lors du traitement de l'enveloppe ${envelope.title}:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de traiter le budget "${envelope.title}"`
      });
    }
  }
  
  console.log(`\n[LOG] 🏁 TRANSITION DES ENVELOPPES TERMINÉE`);
};
