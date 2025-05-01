
import { db } from "@/services/database";
import { TransitionEnvelope, TransitionOption, MultiTransfer } from "@/types/transition";
import { toast } from "@/components/ui/use-toast";
import { Budget } from "@/types/categories";

export const useBudgetTransitioner = () => {
  // Nouvelle fonction: précalcule tous les montants à reporter avant de faire des modifications
  const calculateTransitionAmounts = async (envelopes: TransitionEnvelope[], dashboardId: string) => {
    console.log(`Pré-calcul des montants de transition pour le dashboard: ${dashboardId}`);
    
    // Récupérer tous les budgets du dashboard
    const allBudgets = await db.getBudgets();
    const dashboardBudgets = allBudgets.filter(budget => 
      String(budget.dashboardId || '') === String(dashboardId || '')
    );
    
    // Structure pour stocker les résultats pré-calculés
    const transitionPlan = new Map();
    
    // Récupérer les dépenses actuelles pour analyse
    const allExpenses = await db.getExpenses();
    const dashboardExpenses = allExpenses.filter(expense => 
      String(expense.dashboardId || '') === String(dashboardId || '')
    );
    
    console.log(`DEBUG: Calculer les montants pour ${envelopes.length} enveloppes avec ${dashboardExpenses.length} dépenses`);
    
    // Calculer pour chaque enveloppe
    for (const envelope of envelopes) {
      const budgetToProcess = dashboardBudgets.find(b => b.id === envelope.id);
      if (!budgetToProcess) {
        console.log(`Budget ${envelope.id} (${envelope.title}) non trouvé dans le dashboard`);
        continue;
      }
      
      // Vérifier si ce budget a des dépenses associées
      const budgetExpenses = dashboardExpenses.filter(expense => expense.linkedBudgetId === budgetToProcess.id);
      const totalExpenseAmount = budgetExpenses.reduce((sum, expense) => sum + expense.budget, 0);
      
      console.log(`DEBUG: Budget ${budgetToProcess.title} (${budgetToProcess.id}): ${budgetExpenses.length} dépenses trouvées, total=${totalExpenseAmount}`);
      
      // *** CORRECTION ICI - Calcul du montant restant en prenant en compte les dépenses ***
      // Formule correcte : (budget + carriedOver) - spent
      const totalBudget = budgetToProcess.budget + (budgetToProcess.carriedOver || 0);
      const remainingAmount = totalBudget - budgetToProcess.spent;
      
      console.log(`Pré-calcul détaillé - Budget ${envelope.title}:`);
      console.log(`  Budget initial: ${budgetToProcess.budget}`);
      console.log(`  Report précédent (carriedOver): ${budgetToProcess.carriedOver || 0}`);
      console.log(`  Total disponible (budget + carriedOver): ${totalBudget}`);
      console.log(`  Dépensé selon budget.spent: ${budgetToProcess.spent}`);
      console.log(`  Dépensé selon somme des dépenses: ${totalExpenseAmount}`);
      if (budgetToProcess.spent !== totalExpenseAmount) {
        console.log(`  ⚠️ DIFFÉRENCE DÉTECTÉE entre budget.spent (${budgetToProcess.spent}) et somme des dépenses (${totalExpenseAmount})`);
      }
      console.log(`  Montant restant (total - dépensé): ${remainingAmount}`);
      console.log(`  Option de transition: ${envelope.transitionOption}`);
      
      // Stocker ce montant et l'option pour utilisation ultérieure
      transitionPlan.set(envelope.id, {
        budgetId: envelope.id,
        title: budgetToProcess.title,
        initialBudget: budgetToProcess.budget,
        previousCarriedOver: budgetToProcess.carriedOver || 0,
        spent: budgetToProcess.spent,
        expensesTotal: totalExpenseAmount,
        remainingAmount: Math.max(0, remainingAmount),
        option: envelope.transitionOption,
        partialAmount: envelope.partialAmount,
        transferTargetId: envelope.transferTargetId,
        multiTransfers: envelope.multiTransfers
      });
    }
    
    return transitionPlan;
  };

  const processEnvelopeTransitions = async (envelopes: TransitionEnvelope[], dashboardId: string) => {
    console.log(`Traitement de la transition des enveloppes pour le dashboard: ${dashboardId}`);
    
    // 1. PRÉ-CALCUL des montants à reporter AVANT toute modification
    const transitionPlan = await calculateTransitionAmounts(envelopes, dashboardId);
    console.log("Plan de transition calculé:", transitionPlan);
    
    // 2. Récupérer tous les budgets du dashboard pour appliquer les modifications
    const allBudgets = await db.getBudgets();
    const dashboardBudgets = allBudgets.filter(budget => 
      String(budget.dashboardId || '') === String(dashboardId || '')
    );
    
    // 3. Récupérer aussi toutes les dépenses récurrentes pour référence
    const allExpenses = await db.getExpenses();
    const recurringExpenses = allExpenses.filter(expense => 
      expense.isRecurring && String(expense.dashboardId || '') === String(dashboardId || '')
    );
    
    // 4. Appliquer les transitions selon le plan pré-calculé
    for (const envelope of envelopes) {
      // Vérifier que l'enveloppe appartient au dashboard courant
      const budgetToProcess = dashboardBudgets.find(b => b.id === envelope.id);
      if (!budgetToProcess) {
        console.log(`Budget ${envelope.id} ignoré car il n'appartient pas au dashboard ${dashboardId}`);
        continue;
      }
      
      // Récupérer les valeurs pré-calculées
      const transitionInfo = transitionPlan.get(envelope.id);
      if (!transitionInfo) {
        console.log(`Pas d'information de transition pour le budget ${envelope.id}`);
        continue;
      }
      
      const { remainingAmount } = transitionInfo;
      
      console.log(`Traitement de l'enveloppe ${envelope.id} (${envelope.title}) - Option: ${envelope.transitionOption}`);
      console.log(`État actuel: budget=${budgetToProcess.budget}, carriedOver=${budgetToProcess.carriedOver || 0}, spent=${budgetToProcess.spent}`);
      console.log(`Montant restant pré-calculé: ${remainingAmount}`);
      
      try {
        // Vérifier si ce budget a des dépenses récurrentes associées
        const linkedRecurringExpenses = recurringExpenses.filter(
          expense => expense.linkedBudgetId === budgetToProcess.id
        );
        
        if (linkedRecurringExpenses.length > 0) {
          console.log(`Budget ${envelope.title} a ${linkedRecurringExpenses.length} dépenses récurrentes associées`);
          linkedRecurringExpenses.forEach((expense, idx) => {
            if (idx < 3) { // Limiter à 3 pour éviter trop de logs
              console.log(`  - Dépense récurrente: ${expense.title}, montant: ${expense.budget}`);
            }
          });
        }
        
        switch (envelope.transitionOption) {
          case "keep":
            // Ne rien faire, garder le budget tel quel
            console.log(`Budget ${envelope.title} conservé tel quel`);
            break;
          
          case "reset":
            // Réinitialiser le budget (mettre spent à 0 et carriedOver à 0)
            await updateBudgetSpent(envelope.id, 0);
            // S'assurer que carriedOver est aussi réinitialisé à 0 pour un vrai reset
            await updateBudgetCarriedOver(envelope.id, 0);
            console.log(`Budget ${envelope.title} réinitialisé (spent = 0, carriedOver = 0)`);
            break;
          
          case "carry":
            // Reporter uniquement le montant non dépensé, pas le budget total
            if (remainingAmount > 0) {
              // Stocker uniquement le montant restant dans carriedOver
              await updateBudgetCarriedOver(envelope.id, remainingAmount);
              console.log(`Budget ${envelope.title}: ${remainingAmount} reporté au mois suivant`);
            } else {
              // Si rien à reporter, mettre carriedOver à 0
              await updateBudgetCarriedOver(envelope.id, 0);
              console.log(`Budget ${envelope.title}: rien à reporter (montant restant ≤ 0), carriedOver mis à 0`);
            }
            // Réinitialiser le 'spent'
            await updateBudgetSpent(envelope.id, 0);
            break;
          
          case "partial":
            // Conserver une partie du budget
            if (typeof envelope.partialAmount === 'number') {
              // Vérifier que le montant partiel n'excède pas le montant restant
              const amountToCarry = Math.min(envelope.partialAmount, Math.max(0, remainingAmount));
              // Mettre à jour le montant reporté
              await updateBudgetCarriedOver(envelope.id, amountToCarry);
              // Et réinitialiser le spent
              await updateBudgetSpent(envelope.id, 0);
              console.log(`Budget ${envelope.title} partiellement reporté (${amountToCarry} sur ${remainingAmount} disponible)`);
            }
            break;
          
          case "transfer":
            // Transférer uniquement le montant restant vers une autre enveloppe
            if (envelope.transferTargetId && remainingAmount > 0) {
              await transferBudget(
                envelope.id, 
                envelope.transferTargetId, 
                remainingAmount,
                dashboardId
              );
              console.log(`Budget ${envelope.title} transféré vers ${envelope.transferTargetId} (montant: ${remainingAmount})`);
            } else if (remainingAmount <= 0) {
              console.log(`Budget ${envelope.title}: rien à transférer (montant restant ≤ 0)`);
              // Réinitialiser quand même le spent
              await updateBudgetSpent(envelope.id, 0);
              // Et mettre carriedOver à 0
              await updateBudgetCarriedOver(envelope.id, 0);
            }
            break;
          
          case "multi-transfer":
            // Transferts multiples vers plusieurs enveloppes
            if (envelope.multiTransfers && envelope.multiTransfers.length > 0 && remainingAmount > 0) {
              await processMultiTransfers(
                envelope.id, 
                envelope.multiTransfers, 
                remainingAmount,
                dashboardId
              );
              console.log(`Budget ${envelope.title} transféré vers plusieurs cibles (montant total: ${remainingAmount})`);
            } else if (remainingAmount <= 0) {
              console.log(`Budget ${envelope.title}: rien à transférer en multi (montant restant ≤ 0)`);
              // Réinitialiser quand même le spent
              await updateBudgetSpent(envelope.id, 0);
              // Et mettre carriedOver à 0
              await updateBudgetCarriedOver(envelope.id, 0);
            }
            break;
            
          default:
            console.log(`Option de transition non reconnue pour ${envelope.title}: ${envelope.transitionOption}`);
        }
        
        // Vérifier l'état final après traitement
        const updatedBudget = await db.getBudgets()
          .then(budgets => budgets.find(b => b.id === envelope.id));
        if (updatedBudget) {
          console.log(`État final du budget ${envelope.title}: budget=${updatedBudget.budget}, carriedOver=${updatedBudget.carriedOver || 0}, spent=${updatedBudget.spent}`);
        }
      } catch (error) {
        console.error(`Erreur lors du traitement de l'enveloppe ${envelope.title}:`, error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: `Impossible de traiter le budget "${envelope.title}"`
        });
      }
    }
    
    console.log("Transition des enveloppes terminée");
  };
  
  const updateBudgetSpent = async (budgetId: string, newSpentValue: number) => {
    try {
      const budget = await db.getBudgets()
        .then(budgets => budgets.find(b => b.id === budgetId));
      
      if (budget) {
        console.log(`Mise à jour du spent pour ${budget.title}: ${budget.spent} -> ${newSpentValue}`);
        
        // DEBUG: Vérifier le format et le type de newSpentValue avant mise à jour
        console.log(`DEBUG: Type de newSpentValue: ${typeof newSpentValue}, Valeur: ${newSpentValue}`);
        
        await db.updateBudget({
          ...budget,
          spent: newSpentValue
        });
        
        // Vérifier après mise à jour
        const verifyBudget = await db.getBudgets()
          .then(budgets => budgets.find(b => b.id === budgetId));
        if (verifyBudget) {
          console.log(`Vérification après mise à jour: spent = ${verifyBudget.spent}`);
          if (verifyBudget.spent !== newSpentValue) {
            console.log(`⚠️ ERREUR: La mise à jour de spent n'a pas fonctionné correctement (${verifyBudget.spent} ≠ ${newSpentValue})`);
          }
        }
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du budget ${budgetId}:`, error);
      throw error;
    }
  };
  
  // Fonction pour mettre à jour le montant reporté
  const updateBudgetCarriedOver = async (budgetId: string, carriedOverAmount: number) => {
    try {
      const budget = await db.getBudgets()
        .then(budgets => budgets.find(b => b.id === budgetId));
      
      if (budget) {
        console.log(`Mise à jour du carriedOver pour ${budget.title}: ${budget.carriedOver || 0} -> ${carriedOverAmount}`);
        
        // DEBUG: Vérifier le format et le type de carriedOverAmount avant mise à jour
        console.log(`DEBUG: Type de carriedOverAmount: ${typeof carriedOverAmount}, Valeur: ${carriedOverAmount}`);
        
        await db.updateBudget({
          ...budget,
          carriedOver: carriedOverAmount // Remplacer le montant reporté au lieu de l'additionner
        });
        
        // Vérifier après mise à jour
        const verifyBudget = await db.getBudgets()
          .then(budgets => budgets.find(b => b.id === budgetId));
        if (verifyBudget) {
          console.log(`Vérification après mise à jour: carriedOver = ${verifyBudget.carriedOver}`);
          if (verifyBudget.carriedOver !== carriedOverAmount) {
            console.log(`⚠️ ERREUR: La mise à jour de carriedOver n'a pas fonctionné correctement (${verifyBudget.carriedOver} ≠ ${carriedOverAmount})`);
          }
        }
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du montant reporté pour le budget ${budgetId}:`, error);
      throw error;
    }
  };
  
  const transferBudget = async (sourceId: string, targetId: string, amount: number, dashboardId: string) => {
    try {
      const budgets = await db.getBudgets();
      
      // S'assurer que les budgets appartiennent au dashboard actuel
      const source = budgets.find(b => b.id === sourceId && String(b.dashboardId || '') === String(dashboardId || ''));
      const target = budgets.find(b => b.id === targetId && String(b.dashboardId || '') === String(dashboardId || ''));
      
      if (!source || !target) {
        throw new Error("Budgets source ou cible introuvables ou n'appartiennent pas au dashboard actuel");
      }
      
      // Réinitialiser le budget source (spent = 0 et carriedOver = 0)
      await db.updateBudget({
        ...source,
        spent: 0,
        carriedOver: 0
      });
      
      // Ajouter le montant au montant reporté du budget cible
      const newCarriedOver = (target.carriedOver || 0) + amount;
      await db.updateBudget({
        ...target,
        carriedOver: newCarriedOver
      });
      
      console.log(`Transfert de ${amount} depuis ${source.title} vers ${target.title} (nouveau report cible: ${newCarriedOver})`);
    } catch (error) {
      console.error(`Erreur lors du transfert du budget ${sourceId} vers ${targetId}:`, error);
      throw error;
    }
  };
  
  const processMultiTransfers = async (sourceId: string, transfers: MultiTransfer[], totalAmount: number, dashboardId: string) => {
    try {
      const budgets = await db.getBudgets();
      const source = budgets.find(b => b.id === sourceId && String(b.dashboardId || '') === String(dashboardId || ''));
      
      if (!source) {
        throw new Error("Budget source introuvable ou n'appartient pas au dashboard actuel");
      }
      
      // Réinitialiser le budget source
      await db.updateBudget({
        ...source,
        spent: 0,
        carriedOver: 0 // S'assurer que carriedOver est aussi mis à 0
      });
      
      // Vérifier que la somme des transferts ne dépasse pas le montant total disponible
      let totalTransferred = 0;
      
      // Traiter chaque transfert
      for (const transfer of transfers) {
        const target = budgets.find(b => b.id === transfer.targetId && String(b.dashboardId || '') === String(dashboardId || ''));
        
        if (target) {
          // S'assurer que le montant à transférer est valide et ne dépasse pas ce qui reste
          const transferAmount = Math.min(transfer.amount || 0, totalAmount - totalTransferred);
          if (transferAmount > 0) {
            // Ajouter le montant au report du budget cible
            const newCarriedOver = (target.carriedOver || 0) + transferAmount;
            
            await db.updateBudget({
              ...target,
              carriedOver: newCarriedOver
            });
            
            totalTransferred += transferAmount;
            console.log(`Transfert de ${transferAmount} depuis ${source.title} vers ${target.title} (nouveau report cible: ${newCarriedOver})`);
          }
          
          // Si on a dépassé le montant disponible, arrêter
          if (totalTransferred >= totalAmount) {
            break;
          }
        }
      }
      
      console.log(`Multi-transfert depuis ${source.title}: total transféré = ${totalTransferred} sur ${totalAmount} disponible`);
    } catch (error) {
      console.error(`Erreur lors des transferts multiples depuis ${sourceId}:`, error);
      throw error;
    }
  };

  return {
    processEnvelopeTransitions,
    calculateTransitionAmounts
  };
};
