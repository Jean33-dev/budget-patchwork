
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
            const updatedBudgets = category.budgets.map((budget: string) => {
              if (budget === budgetTitle) {
                switch (envelope.transitionOption) {
                  case "reset":
                    return budget;
                  case "carry":
                    return budget;
                  case "partial":
                    return budget;
                  case "transfer":
                    return budget;
                  default:
                    return budget;
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
