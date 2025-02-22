
import { useToast } from "@/hooks/use-toast";
import { TransitionEnvelope } from "@/types/transition";
import { db } from "@/services/database";

export const useTransitionHandling = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { toast } = useToast();

  const handleMonthTransition = async (envelopes: TransitionEnvelope[]) => {
    let success = true;
    
    try {
      for (const envelope of envelopes) {
        const [categoryId, budgetTitle] = envelope.id.split("-");
        
        const updatedCategories = categories.map(category => {
          if (category.id === categoryId) {
            const updatedBudgets = category.budgets.map((budget: any) => {
              if (budget.id === budgetTitle) {
                const currentRemaining = budget.budget - budget.spent;
                
                switch (envelope.transitionOption) {
                  case "reset":
                    // Réinitialise le budget à sa valeur initiale
                    return {
                      ...budget,
                      spent: 0
                    };
                  
                  case "carry":
                    // Ajoute le solde restant au budget du mois suivant
                    return {
                      ...budget,
                      budget: budget.budget + currentRemaining,
                      spent: 0
                    };
                  
                  case "partial":
                    // Ajoute le montant spécifié au budget du mois suivant
                    if (envelope.partialAmount !== undefined) {
                      return {
                        ...budget,
                        budget: budget.budget + envelope.partialAmount,
                        spent: 0
                      };
                    }
                    return budget;
                  
                  case "transfer":
                    // Pour le budget source, on réinitialise simplement
                    return {
                      ...budget,
                      spent: 0
                    };
                  
                  default:
                    return budget;
                }
              }
              
              // Si c'est le budget cible d'un transfert
              if (envelope.transitionOption === "transfer" && 
                  envelope.transferTargetId === `${category.id}-${budget.id}`) {
                const sourceEnvelope = envelopes.find(e => e.id === envelope.id);
                if (sourceEnvelope) {
                  const [sourceCatId, sourceBudgetTitle] = envelope.id.split("-");
                  const sourceCat = categories.find(c => c.id === sourceCatId);
                  const sourceBudget = sourceCat?.budgets.find((b: any) => b.id === sourceBudgetTitle);
                  
                  if (sourceBudget) {
                    const transferAmount = sourceBudget.budget - sourceBudget.spent;
                    return {
                      ...budget,
                      budget: budget.budget + transferAmount,
                      spent: 0
                    };
                  }
                }
              }
              
              return budget;
            });

            return {
              ...category,
              budgets: updatedBudgets
            };
          }
          return category;
        });

        setCategories(updatedCategories);
        
        const updatedCategory = updatedCategories.find(c => c.id === categoryId);
        if (updatedCategory) {
          await db.updateCategory(updatedCategory);
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
