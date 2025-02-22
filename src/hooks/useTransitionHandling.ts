
import { useToast } from "@/hooks/use-toast";
import { TransitionEnvelope } from "@/types/transition";
import { db } from "@/services/database";

export const useTransitionHandling = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { toast } = useToast();

  const handleMonthTransition = async (envelopes: TransitionEnvelope[]) => {
    let success = true;
    
    try {
      for (const envelope of envelopes) {
        const budget = await db.getBudgets().then(budgets => 
          budgets.find(b => b.id === envelope.id)
        );

        if (!budget) continue;

        const currentRemaining = budget.budget - budget.spent;
        let newBudgetAmount = budget.budget;
        
        switch (envelope.transitionOption) {
          case "reset":
            // Réinitialise le budget à sa valeur initiale
            await db.updateBudget({
              ...budget,
              spent: 0
            });
            break;
          
          case "carry":
            // Ajoute le solde restant au budget du mois suivant
            newBudgetAmount = budget.budget + currentRemaining;
            await db.updateBudget({
              ...budget,
              budget: newBudgetAmount,
              spent: 0
            });
            break;
          
          case "partial":
            // Ajoute le montant spécifié au budget du mois suivant
            if (envelope.partialAmount !== undefined) {
              newBudgetAmount = budget.budget + envelope.partialAmount;
              await db.updateBudget({
                ...budget,
                budget: newBudgetAmount,
                spent: 0
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
                // Mettre à jour le budget source (réinitialisation)
                await db.updateBudget({
                  ...budget,
                  spent: 0
                });

                // Mettre à jour le budget cible (ajout du montant restant)
                await db.updateBudget({
                  ...targetBudget,
                  budget: targetBudget.budget + currentRemaining,
                  spent: targetBudget.spent
                });
              }
            }
            break;
        }

        // Réinitialiser les dépenses liées à ce budget
        const expenses = await db.getExpenses();
        const budgetExpenses = expenses.filter(exp => exp.linkedBudgetId === envelope.id);
        
        for (const expense of budgetExpenses) {
          await db.updateExpense({
            ...expense,
            budget: 0,
            spent: 0
          });
        }
      }

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

  return {
    handleMonthTransition
  };
};
