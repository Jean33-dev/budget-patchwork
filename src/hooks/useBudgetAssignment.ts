
import { Budget } from "@/types/categories";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { createBudgetAssignmentUtils } from "@/utils/budget-assignment-utils";
import { calculateCategoryTotals } from "@/utils/budget-calculations";

export const useBudgetAssignment = (categories: any[], setCategories: (categories: any[]) => void) => {
  const { toast } = useToast();
  const budgetUtils = createBudgetAssignmentUtils(categories);

  const updateCategoryTotals = async (categoryId: string, availableBudgets: Budget[]) => {
    try {
      console.log("Mise à jour des totaux pour la catégorie:", categoryId);
      console.log("Budgets disponibles:", availableBudgets);
      
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          const { total, spent } = calculateCategoryTotals(category.budgets, availableBudgets);
          console.log("Nouveaux totaux calculés:", { total, spent });
          return {
            ...category,
            total,
            spent
          };
        }
        return category;
      });

      setCategories(updatedCategories);
      
      const updatedCategory = updatedCategories.find(c => c.id === categoryId);
      if (updatedCategory) {
        console.log("Mise à jour de la catégorie dans la DB:", updatedCategory);
        await db.updateCategory(updatedCategory);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des totaux:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les totaux"
      });
    }
  };

  const handleAssignBudget = async (categoryId: string, budgetId: string, availableBudgets: Budget[]) => {
    try {
      console.log("Assignation du budget:", { categoryId, budgetId });
      
      // Trouver la catégorie actuelle
      const currentCategory = categories.find(c => c.id === categoryId);
      if (!currentCategory) {
        throw new Error("Catégorie non trouvée");
      }

      // Créer le nouveau tableau de budgets pour la catégorie
      const currentBudgets = Array.isArray(currentCategory.budgets) ? currentCategory.budgets : [];
      const newBudgets = [...new Set([...currentBudgets, budgetId])]; // Utiliser Set pour éviter les doublons
      console.log("Nouveaux budgets de la catégorie:", newBudgets);

      // Créer la catégorie mise à jour
      const updatedCategory = {
        ...currentCategory,
        budgets: newBudgets
      };

      // Mettre à jour l'état local des catégories
      const updatedCategories = categories.map(category =>
        category.id === categoryId ? updatedCategory : category
      );

      // Sauvegarder dans la base de données AVANT de mettre à jour l'état
      console.log("Sauvegarde de la catégorie dans la DB:", updatedCategory);
      await db.updateCategory(updatedCategory);

      // Mettre à jour l'état global APRÈS la sauvegarde réussie
      setCategories(updatedCategories);

      toast({
        title: "Budget assigné",
        description: "Le budget a été assigné à la catégorie avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de l'assignation du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'assigner le budget"
      });
      throw error; // Propager l'erreur pour la gestion dans le composant
    }
  };

  const handleRemoveBudget = async (categoryId: string, budgetId: string, availableBudgets: Budget[]) => {
    try {
      console.log("Retrait du budget:", { categoryId, budgetId });
      
      // Trouver la catégorie actuelle
      const currentCategory = categories.find(c => c.id === categoryId);
      if (!currentCategory) {
        throw new Error("Catégorie non trouvée");
      }

      // Créer le nouveau tableau de budgets pour la catégorie
      const currentBudgets = Array.isArray(currentCategory.budgets) ? currentCategory.budgets : [];
      const newBudgets = currentBudgets.filter(b => b !== budgetId);
      console.log("Nouveaux budgets de la catégorie après retrait:", newBudgets);

      // Créer la catégorie mise à jour
      const updatedCategory = {
        ...currentCategory,
        budgets: newBudgets
      };

      // Sauvegarder dans la base de données AVANT de mettre à jour l'état
      console.log("Sauvegarde de la catégorie dans la DB:", updatedCategory);
      await db.updateCategory(updatedCategory);

      // Mettre à jour l'état local des catégories APRÈS la sauvegarde réussie
      const updatedCategories = categories.map(category =>
        category.id === categoryId ? updatedCategory : category
      );
      setCategories(updatedCategories);

      toast({
        title: "Budget retiré",
        description: "Le budget a été retiré de la catégorie avec succès."
      });
    } catch (error) {
      console.error("Erreur lors du retrait du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de retirer le budget"
      });
      throw error; // Propager l'erreur pour la gestion dans le composant
    }
  };

  return {
    handleAssignBudget,
    handleRemoveBudget,
    getAvailableBudgetsForCategory: budgetUtils.getAvailableBudgetsForCategory,
    updateCategoryTotals
  };
};
