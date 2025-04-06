import { useToast } from "@/hooks/use-toast";
import { TransitionEnvelope } from "@/types/transition";
import { db } from "@/services/database";
import { useTransitionPreferences } from "./useTransitionPreferences";
import { v4 as uuidv4 } from 'uuid';

export const useTransitionProcessor = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { toast } = useToast();
  const { saveTransitionPreferences } = useTransitionPreferences();

  const handleMonthTransition = async (envelopes: TransitionEnvelope[]) => {
    let success = true;
    
    try {
      // Save preferences for next time
      saveTransitionPreferences(envelopes);
      
      // Récupérer les dépenses et revenus fixes avant la suppression
      const expenses = await db.getExpenses();
      const fixedExpenses = expenses.filter(expense => expense.isFixed === true);
      console.log(`Trouvé ${fixedExpenses.length} dépenses fixes à reporter`);
      
      const incomes = await db.getIncomes();
      const fixedIncomes = incomes.filter(income => income.isFixed === true);
      console.log(`Trouvé ${fixedIncomes.length} revenus fixes à reporter`);
      
      // Traitement des budgets pour la transition
      await processEnvelopeTransitions(envelopes);
      
      // Suppression des dépenses non-fixes
      console.log(`Suppression de ${expenses.length - fixedExpenses.length} dépenses non-fixes`);
      const nonFixedExpenses = expenses.filter(expense => !expense.isFixed);
      await Promise.all(
        nonFixedExpenses.map(expense => db.deleteExpense(expense.id))
      );
      
      // Suppression des revenus non-fixes
      console.log(`Suppression de ${incomes.length - fixedIncomes.length} revenus non-fixes`);
      const nonFixedIncomes = incomes.filter(income => !income.isFixed);
      await Promise.all(
        nonFixedIncomes.map(income => db.deleteIncome(income.id))
      );
      
      // Mettre à jour la date des dépenses et revenus fixes pour le mois suivant
      await updateFixedTransactionsForNextMonth(fixedExpenses, fixedIncomes);

      console.log("Vérification après transition:");
      const remainingExpenses = await db.getExpenses();
      const remainingIncomes = await db.getIncomes();
      console.log(`Dépenses restantes: ${remainingExpenses.length}`);
      console.log(`Revenus restants: ${remainingIncomes.length}`);
      
      // Maintenant, mettons à jour les spent des catégories
      console.log("Mise à jour des catégories après transition");
      const updatedCategories = [...categories];
      
      for (let category of updatedCategories) {
        // Réinitialiser le montant dépensé à 0 puisque toutes les dépenses ont été supprimées
        category.spent = 0;
        await db.updateCategory(category);
        console.log(`Catégorie ${category.name} mise à jour, dépenses réinitialisées à 0`);
      }
      
      // Mettre à jour l'état local des catégories
      setCategories(updatedCategories);

      toast({
        title: "Transition effectuée",
        description: "Les budgets ont été mis à jour pour le nouveau mois."
      });
    } catch (error) {
      console.error("Erreur lors de la transition:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la transition des budgets."
      });
      success = false;
    }

    return success;
  };

  const updateFixedTransactionsForNextMonth = async (fixedExpenses, fixedIncomes) => {
    // Obtenir la date pour le mois suivant
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    const nextMonthDateString = nextMonth.toISOString().split('T')[0];
    
    console.log(`Mise à jour des dates pour ${fixedExpenses.length} dépenses fixes et ${fixedIncomes.length} revenus fixes`);
    
    // Mise à jour des dates des dépenses fixes
    for (const expense of fixedExpenses) {
      const updatedExpense = {
        ...expense,
        date: nextMonthDateString
      };
      console.log(`Mise à jour de la date pour la dépense fixe: ${updatedExpense.title}`);
      await db.updateExpense(updatedExpense);
    }
    
    // Mise à jour des dates des revenus fixes
    for (const income of fixedIncomes) {
      const updatedIncome = {
        ...income,
        date: nextMonthDateString
      };
      console.log(`Mise à jour de la date pour le revenu fixe: ${updatedIncome.title}`);
      await db.updateIncome(updatedIncome);
    }
    
    console.log(`Total: ${fixedExpenses.length} dépenses fixes et ${fixedIncomes.length} revenus fixes mis à jour pour le prochain mois`);
  };

  const processEnvelopeTransitions = async (envelopes: TransitionEnvelope[]) => {
    // Traitement des budgets pour la transition
    for (const envelope of envelopes) {
      const budget = await db.getBudgets().then(budgets => 
        budgets.find(b => b.id === envelope.id)
      );

      if (!budget) continue;

      // Calcul du montant restant : budget initial + report précédent - dépenses
      const currentRemaining = budget.budget + (budget.carriedOver || 0) - budget.spent;
      console.log(`Transition du budget ${budget.title}:`, {
        budgetInitial: budget.budget,
        carriedOver: budget.carriedOver || 0,
        spent: budget.spent,
        remaining: currentRemaining,
        transitionOption: envelope.transitionOption
      });
      
      switch (envelope.transitionOption) {
        case "reset":
          // Réinitialise les dépenses et le report, garde le budget initial
          await db.updateBudget({
            ...budget,
            spent: 0,
            carriedOver: 0
          });
          console.log(`Reset - Nouveau budget état:`, {
            title: budget.title,
            spent: 0,
            carriedOver: 0
          });
          break;
        
        case "carry":
          // Garde le même budget mais ajoute le solde restant au report
          await db.updateBudget({
            ...budget,
            spent: 0,
            carriedOver: currentRemaining
          });
          console.log(`Report total - Nouveau budget état:`, {
            title: budget.title,
            spent: 0,
            carriedOver: currentRemaining
          });
          break;
        
        case "partial":
          // Garde le même budget mais ajoute le montant spécifié au report
          if (envelope.partialAmount !== undefined) {
            await db.updateBudget({
              ...budget,
              spent: 0,
              carriedOver: envelope.partialAmount
            });
            console.log(`Report partiel - Nouveau budget état:`, {
              title: budget.title,
              spent: 0,
              carriedOver: envelope.partialAmount
            });
          }
          break;
        
        case "transfer":
          if (envelope.transferTargetId) {
            // Récupérer le budget cible
            const targetBudget = await db.getBudgets().then(budgets => 
              budgets.find(b => b.id === envelope.transferTargetId)
            );

            if (targetBudget) {
              // Réinitialise le budget source
              await db.updateBudget({
                ...budget,
                spent: 0,
                carriedOver: 0
              });

              // Ajoute le montant restant au report du budget cible
              await db.updateBudget({
                ...targetBudget,
                carriedOver: (targetBudget.carriedOver || 0) + currentRemaining
              });

              console.log(`Transfert - Nouveau état:`, {
                sourceBudget: {
                  title: budget.title,
                  spent: 0,
                  carriedOver: 0
                },
                targetBudget: {
                  title: targetBudget.title,
                  carriedOver: (targetBudget.carriedOver || 0) + currentRemaining
                }
              });
            }
          }
          break;
          
        case "multi-transfer":
          if (envelope.multiTransfers && envelope.multiTransfers.length > 0) {
            console.log(`Transferts multiples pour ${budget.title}:`, envelope.multiTransfers);
            
            // Calculer le montant total à transférer
            const totalTransferAmount = envelope.multiTransfers.reduce(
              (sum, transfer) => sum + transfer.amount, 0
            );
            
            // S'assurer que le montant total n'excède pas le montant disponible
            if (totalTransferAmount <= currentRemaining) {
              // Réinitialiser le budget source avec le montant restant non transféré
              const remainingAfterTransfers = currentRemaining - totalTransferAmount;
              
              await db.updateBudget({
                ...budget,
                spent: 0,
                carriedOver: remainingAfterTransfers
              });
              
              console.log(`Multi-transfert - Budget source mis à jour:`, {
                title: budget.title,
                spent: 0,
                carriedOver: remainingAfterTransfers
              });
              
              // Distribuer les montants aux budgets cibles
              for (const transfer of envelope.multiTransfers) {
                // Récupérer le budget cible
                const targetBudget = await db.getBudgets().then(budgets => 
                  budgets.find(b => b.id === transfer.targetId)
                );
                
                if (targetBudget) {
                  // Ajouter le montant au report du budget cible
                  await db.updateBudget({
                    ...targetBudget,
                    carriedOver: (targetBudget.carriedOver || 0) + transfer.amount
                  });
                  
                  console.log(`Multi-transfert - Budget cible mis à jour:`, {
                    title: targetBudget.title,
                    amount: transfer.amount,
                    newCarriedOver: (targetBudget.carriedOver || 0) + transfer.amount
                  });
                }
              }
            } else {
              console.error(`Montant total de transfert (${totalTransferAmount}) supérieur au montant disponible (${currentRemaining})`);
            }
          }
          break;
      }
    }
  };

  return {
    handleMonthTransition
  };
};
