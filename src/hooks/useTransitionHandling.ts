
import { useToast } from "@/hooks/use-toast";
import { TransitionEnvelope } from "@/types/transition";
import { db } from "@/services/database";

export const useTransitionHandling = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { toast } = useToast();

  const handleMonthTransition = async (envelopes: TransitionEnvelope[]) => {
    let success = true;
    
    try {
      // Suppression de toutes les dépenses
      const expenses = await db.getExpenses();
      console.log(`Suppression de ${expenses.length} dépenses`);
      
      // Utiliser Promise.all pour supprimer toutes les dépenses en parallèle
      await Promise.all(
        expenses.map(expense => db.deleteExpense(expense.id))
      );
      
      // Suppression de tous les revenus
      const incomes = await db.getIncomes();
      console.log(`Suppression de ${incomes.length} revenus`);
      
      // Utiliser Promise.all pour supprimer tous les revenus en parallèle
      await Promise.all(
        incomes.map(income => db.deleteIncome(income.id))
      );
      
      console.log("Vérification après suppression:");
      const remainingExpenses = await db.getExpenses();
      const remainingIncomes = await db.getIncomes();
      console.log(`Dépenses restantes: ${remainingExpenses.length}`);
      console.log(`Revenus restants: ${remainingIncomes.length}`);
      
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
        }
      }

      // Maintenant, mettons à jour les spent des catégories
      console.log("Mise à jour des catégories après transition");
      const updatedCategories = [...categories];
      const budgets = await db.getBudgets();
      
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

  return {
    handleMonthTransition
  };
};
