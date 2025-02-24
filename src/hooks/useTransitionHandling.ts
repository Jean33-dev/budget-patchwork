
import { useToast } from "@/hooks/use-toast";
import { TransitionEnvelope } from "@/types/transition";
import { db } from "@/services/database";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const useTransitionHandling = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { toast } = useToast();

  const handleMonthTransition = async (envelopes: TransitionEnvelope[]) => {
    let success = true;
    
    try {
      // 1. Fermer la période en cours
      const currentPeriod = await db.getCurrentPeriod();
      const today = new Date().toISOString().split('T')[0];
      await db.closePeriod(currentPeriod.id, today);

      // 2. Créer une nouvelle période
      const newPeriod = {
        id: Date.now().toString(),
        startDate: today,
        endDate: null,
        name: format(new Date(), 'MMMM yyyy', { locale: fr })
      };
      await db.addBudgetPeriod(newPeriod);

      // 3. Gérer les transitions de budgets
      for (const envelope of envelopes) {
        const budget = await db.getBudgets().then(budgets => 
          budgets.find(b => b.id === envelope.id)
        );

        if (!budget) continue;

        const currentRemaining = budget.budget + (budget.carriedOver || 0) - budget.spent;
        
        switch (envelope.transitionOption) {
          case "reset":
            await db.updateBudget({
              ...budget,
              spent: 0,
              carriedOver: 0
            });
            break;
          
          case "carry":
            await db.updateBudget({
              ...budget,
              spent: 0,
              carriedOver: currentRemaining
            });
            break;
          
          case "partial":
            if (envelope.partialAmount !== undefined) {
              await db.updateBudget({
                ...budget,
                spent: 0,
                carriedOver: envelope.partialAmount
              });
            }
            break;
          
          case "transfer":
            if (envelope.transferTargetId) {
              const targetBudget = await db.getBudgets().then(budgets => 
                budgets.find(b => b.id === envelope.transferTargetId)
              );

              if (targetBudget) {
                await db.updateBudget({
                  ...budget,
                  spent: 0,
                  carriedOver: 0
                });

                await db.updateBudget({
                  ...targetBudget,
                  carriedOver: (targetBudget.carriedOver || 0) + currentRemaining
                });
              }
            }
            break;
        }
      }

      toast({
        title: "Transition effectuée",
        description: "Les budgets ont été mis à jour pour la nouvelle période."
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
