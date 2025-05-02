
import { toast } from "@/components/ui/use-toast";
import { Budget } from '@/services/database/models/budget';
import { TransitionEnvelope, MultiTransfer } from "@/types/transition";
import { db } from "@/services/database";

export const useBudgetTransitioner = () => {
  // Nouvelle fonction: précalcule tous les montants à reporter avant de faire des modifications
  const calculateTransitionAmounts = async (envelopes: TransitionEnvelope[], dashboardId: string) => {
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
        remainingAmount: Math.max(0, remainingAmount),
        option: envelope.transitionOption,
        partialAmount: envelope.partialAmount,
        transferTargetId: envelope.transferTargetId,
        multiTransfers: envelope.multiTransfers
      });
      
      console.log(`[LOG] ✅ Plan de transition créé pour ${budgetToProcess.title}: montant à reporter = ${Math.max(0, remainingAmount)}`);
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

  const processEnvelopeTransitions = async (envelopes: TransitionEnvelope[], dashboardId: string) => {
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
            if (remainingAmount > 0) {
              console.log(`[LOG] 🔄 - Montant à reporter: ${remainingAmount}`);
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
            } else {
              console.log(`[LOG] 🔄 Rien à reporter (montant restant ≤ 0), carriedOver mis à 0`);
              await updateBudgetCarriedOver(envelope.id, 0);
            }
            
            // Réinitialiser le 'spent'
            console.log(`[LOG] 🔄 Réinitialisation de spent à 0`);
            await updateBudgetSpent(envelope.id, 0);
            console.log(`[LOG] ✅ Report terminé pour ${envelope.title}`);
            break;
          
          case "partial":
            console.log(`[LOG] 🔄 Report partiel pour ${envelope.title}...`);
            if (typeof envelope.partialAmount === 'number') {
              // Vérifier que le montant partiel n'excède pas le montant restant
              const amountToCarry = Math.min(envelope.partialAmount, Math.max(0, remainingAmount));
              console.log(`[LOG] 🔄 - Montant partial demandé: ${envelope.partialAmount}`);
              console.log(`[LOG] 🔄 - Montant restant disponible: ${remainingAmount}`);
              console.log(`[LOG] 🔄 - Montant final à reporter: ${amountToCarry}`);
              
              // Mettre à jour le montant reporté
              console.log(`[LOG] 🔄 - Mise à jour de carriedOver: ${budgetToProcess.carriedOver || 0} -> ${amountToCarry}`);
              await updateBudgetCarriedOver(envelope.id, amountToCarry);
              
              // Et réinitialiser le spent
              console.log(`[LOG] 🔄 - Réinitialisation de spent à 0`);
              await updateBudgetSpent(envelope.id, 0);
              console.log(`[LOG] ✅ Report partiel terminé pour ${envelope.title}`);
            } else {
              console.log(`[LOG] ⚠️ Montant partiel non défini pour ${envelope.title}, aucune action effectuée`);
            }
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
  
  const updateBudgetSpent = async (budgetId: string, newSpentValue: number) => {
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
  
  // Fonction pour mettre à jour le montant reporté
  const updateBudgetCarriedOver = async (budgetId: string, carriedOverAmount: number) => {
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
  
  const transferBudget = async (sourceId: string, targetId: string, amount: number, dashboardId: string) => {
    try {
      console.log(`[LOG] 🔄 transferBudget - Transfert depuis ${sourceId} vers ${targetId}, montant: ${amount}`);
      
      const budgets = await db.getBudgets();
      
      // S'assurer que les budgets appartiennent au dashboard actuel
      const source = budgets.find(b => b.id === sourceId && String(b.dashboardId || '') === String(dashboardId || ''));
      const target = budgets.find(b => b.id === targetId && String(b.dashboardId || '') === String(dashboardId || ''));
      
      if (!source || !target) {
        console.log(`[LOG] ❌ transferBudget - Budgets source ou cible introuvables ou n'appartiennent pas au dashboard ${dashboardId}`);
        
        if (!source) {
          console.log(`[LOG] ❌ transferBudget - Budget source ${sourceId} non trouvé`);
        }
        
        if (!target) {
          console.log(`[LOG] ❌ transferBudget - Budget cible ${targetId} non trouvé`);
        }
        
        throw new Error("Budgets source ou cible introuvables ou n'appartiennent pas au dashboard spécifié.");
      }
      
      console.log(`[LOG] 🔄 transferBudget - Source: ${source.title}, Cible: ${target.title}`);
      console.log(`[LOG] 🔄 transferBudget - Montant à transférer: ${amount}`);
      
      // 1. Mettre à jour la source : réinitialiser spent et carriedOver
      await updateBudgetSpent(sourceId, 0);
      await updateBudgetCarriedOver(sourceId, 0);
      console.log(`[LOG] ✅ transferBudget - Source ${source.title} réinitialisée (spent=0, carriedOver=0)`);
      
      // 2. Mettre à jour la cible : ajouter le montant au carriedOver existant
      const targetCurrentCarriedOver = target.carriedOver || 0;
      const targetNewCarriedOver = targetCurrentCarriedOver + amount;
      
      console.log(`[LOG] 🔄 transferBudget - Cible ${target.title}: carriedOver actuel=${targetCurrentCarriedOver}, nouveau=${targetNewCarriedOver}`);
      await updateBudgetCarriedOver(targetId, targetNewCarriedOver);
      
      // Vérification finale
      const updatedTarget = await db.getBudgets()
        .then(budgets => budgets.find(b => b.id === targetId));
      
      if (updatedTarget) {
        console.log(`[LOG] ✅ transferBudget - Vérification après transfert: carriedOver de ${target.title} = ${updatedTarget.carriedOver}`);
        if (updatedTarget.carriedOver !== targetNewCarriedOver) {
          console.log(`[LOG] ⚠️ transferBudget - ATTENTION: Le transfert semble ne pas avoir été correctement appliqué! Attendu: ${targetNewCarriedOver}, Obtenu: ${updatedTarget.carriedOver}`);
        } else {
          console.log(`[LOG] ✅ transferBudget - Transfert réussi de ${source.title} vers ${target.title}`);
        }
      }
    } catch (error) {
      console.error(`[LOG] ❌ transferBudget - Erreur lors du transfert:`, error);
      throw error;
    }
  };

  const processMultiTransfers = async (
    sourceId: string,
    transfers: MultiTransfer[],
    totalAmount: number,
    dashboardId: string
  ) => {
    try {
      console.log(`[LOG] 🔄 processMultiTransfers - Transferts multiples depuis ${sourceId}, montant total: ${totalAmount}`);
      
      if (!transfers || transfers.length === 0) {
        console.log(`[LOG] ⚠️ processMultiTransfers - Aucun transfert à effectuer`);
        return;
      }

      const budgets = await db.getBudgets();
      const source = budgets.find(b => b.id === sourceId);
      
      if (!source) {
        console.log(`[LOG] ❌ processMultiTransfers - Budget source ${sourceId} non trouvé`);
        throw new Error(`Budget source non trouvé: ${sourceId}`);
      }
      
      console.log(`[LOG] 🔄 processMultiTransfers - Source: ${source.title}`);
      console.log(`[LOG] 🔄 processMultiTransfers - Nombre de transferts: ${transfers.length}`);
      
      // Valider les pourcentages ou montants
      let isValidDistribution = true;
      const transferDetails = transfers.map(transfer => {
        const targetBudget = budgets.find(b => b.id === transfer.targetId);
        const targetTitle = targetBudget ? targetBudget.title : "Budget inconnu";
        
        if (!targetBudget) {
          console.log(`[LOG] ⚠️ processMultiTransfers - Budget cible ${transfer.targetId} non trouvé`);
          isValidDistribution = false;
        }
        
        return {
          targetId: transfer.targetId,
          targetTitle,
          amount: transfer.amount,
          exists: !!targetBudget
        };
      });
      
      if (!isValidDistribution) {
        console.log(`[LOG] ❌ processMultiTransfers - Distribution invalide: certains budgets cibles n'existent pas`);
        throw new Error("Certains budgets cibles n'existent pas");
      }
      
      // Calculer la somme totale à transférer
      const sumOfTransfers = transfers.reduce((sum, t) => sum + t.amount, 0);
      console.log(`[LOG] 🧮 processMultiTransfers - Somme des transferts: ${sumOfTransfers}`);
      
      // Vérifier si la somme dépasse le montant disponible
      if (sumOfTransfers > totalAmount) {
        console.log(`[LOG] ⚠️ processMultiTransfers - La somme des transferts (${sumOfTransfers}) dépasse le montant disponible (${totalAmount})`);
        // On peut décider de proportionner ou d'échouer
        // Ici on va proportionner
        transfers = transfers.map(t => ({
          ...t,
          amount: t.amount * ratio
        }));
        console.log(`[LOG] 🧮 processMultiTransfers - Ajustement des montants avec ratio ${ratio}`);
      }
      
      // Effectuer les transferts un par un
      for (const transfer of transfers) {
        const targetBudget = budgets.find(b => b.id === transfer.targetId);
        if (!targetBudget) continue; // Déjà vérifié plus haut
        
        console.log(`[LOG] 🔄 processMultiTransfers - Traitement du transfert vers ${targetBudget.title}: ${transfer.amount}`);
        
        // Ajouter le montant au carriedOver de la cible
        const targetCurrentCarriedOver = targetBudget.carriedOver || 0;
        const targetNewCarriedOver = targetCurrentCarriedOver + transfer.amount;
        
        console.log(`[LOG] 🔄 processMultiTransfers - Mise à jour de ${targetBudget.title}: carriedOver ${targetCurrentCarriedOver} -> ${targetNewCarriedOver}`);
        await updateBudgetCarriedOver(transfer.targetId, targetNewCarriedOver);
      }
      
      // Réinitialiser la source après tous les transferts
      console.log(`[LOG] 🔄 processMultiTransfers - Réinitialisation de la source ${source.title}`);
      await updateBudgetSpent(sourceId, 0);
      await updateBudgetCarriedOver(sourceId, 0);
      
      console.log(`[LOG] ✅ processMultiTransfers - Transferts multiples terminés depuis ${source.title}`);
      
      // Vérification finale
      const updatedBudgets = await db.getBudgets();
      console.log(`[LOG] 📊 processMultiTransfers - Vérification finale des budgets après transferts multiples:`);
      
      // Vérifier la source
      const updatedSource = updatedBudgets.find(b => b.id === sourceId);
      if (updatedSource) {
        console.log(`[LOG] 📊 Source ${updatedSource.title}: spent=${updatedSource.spent}, carriedOver=${updatedSource.carriedOver || 0}`);
      }
      
      // Vérifier chaque cible
      for (const transfer of transfers) {
        const updatedTarget = updatedBudgets.find(b => b.id === transfer.targetId);
        if (updatedTarget) {
          console.log(`[LOG] 📊 Cible ${updatedTarget.title}: carriedOver=${updatedTarget.carriedOver || 0}`);
        }
      }
    } catch (error) {
      console.error(`[LOG] ❌ processMultiTransfers - Erreur lors des transferts multiples:`, error);
      throw error;
    }
  };

  return {
    processEnvelopeTransitions,
    calculateTransitionAmounts
  };
};
