
import { useState, useEffect } from "react";
import { Category, Budget } from "@/types/categories";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES_STORAGE_KEY = "app_categories";

const defaultCategories: Category[] = [
  { 
    id: "necessaire", 
    name: "Nécessaire", 
    budgets: [],
    total: 0,
    spent: 0,
    description: "Dépenses essentielles comme le logement, l'alimentation, etc."
  },
  { 
    id: "plaisir", 
    name: "Plaisir", 
    budgets: [],
    total: 0,
    spent: 0,
    description: "Loisirs, sorties, shopping, etc."
  },
  { 
    id: "epargne", 
    name: "Épargne", 
    budgets: [],
    total: 0,
    spent: 0,
    description: "Économies et investissements"
  }
];

type TransitionOption = "reset" | "carry" | "partial" | "transfer";

interface TransitionEnvelope {
  id: string;
  title: string;
  transitionOption: TransitionOption;
  partialAmount?: number;
  transferTargetId?: string;
}

export const useCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  useEffect(() => {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const getAssignedBudgets = () => {
    const assignedBudgets = new Set<string>();
    categories.forEach(category => {
      category.budgets.forEach(budget => {
        assignedBudgets.add(budget);
      });
    });
    return assignedBudgets;
  };

  const updateCategoryTotals = (categoryId: string, availableBudgets: Budget[]) => {
    setCategories(prevCategories => {
      return prevCategories.map(category => {
        if (category.id === categoryId) {
          const total = category.budgets.reduce((sum, budgetTitle) => {
            const budget = availableBudgets.find(b => b.title === budgetTitle);
            return sum + (budget?.amount || 0);
          }, 0);

          const spent = category.budgets.reduce((sum, budgetTitle) => {
            const budget = availableBudgets.find(b => b.title === budgetTitle);
            return sum + (budget?.spent || 0);
          }, 0);

          return {
            ...category,
            total,
            spent
          };
        }
        return category;
      });
    });
  };

  const handleAssignBudget = (categoryId: string, budgetId: string, availableBudgets: Budget[]) => {
    const selectedBudget = availableBudgets.find(b => b.id === budgetId);
    if (!selectedBudget) return;

    const assignedBudgets = getAssignedBudgets();
    if (assignedBudgets.has(selectedBudget.title)) {
      toast({
        variant: "destructive",
        title: "Budget déjà assigné",
        description: "Ce budget est déjà assigné à une autre catégorie."
      });
      return;
    }

    setCategories(prevCategories => {
      return prevCategories.map(category => {
        if (category.id === categoryId) {
          if (!category.budgets.includes(selectedBudget.title)) {
            return {
              ...category,
              budgets: [...category.budgets, selectedBudget.title]
            };
          }
        }
        return category;
      });
    });

    updateCategoryTotals(categoryId, availableBudgets);

    toast({
      title: "Budget assigné",
      description: "Le budget a été assigné à la catégorie avec succès."
    });
  };

  const handleRemoveBudget = (categoryId: string, budgetTitle: string) => {
    setCategories(prevCategories => {
      return prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            budgets: category.budgets.filter(b => b !== budgetTitle)
          };
        }
        return category;
      });
    });

    toast({
      title: "Budget retiré",
      description: "Le budget a été retiré de la catégorie avec succès."
    });
  };

  const updateCategoryName = (categoryId: string, newName: string) => {
    if (!newName.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de la catégorie ne peut pas être vide."
      });
      return false;
    }

    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === categoryId
          ? { ...cat, name: newName }
          : cat
      )
    );

    toast({
      title: "Catégorie modifiée",
      description: "La catégorie a été modifiée avec succès."
    });

    return true;
  };

  const getAvailableBudgetsForCategory = (categoryId: string, availableBudgets: Budget[]) => {
    const assignedBudgets = getAssignedBudgets();
    const currentCategory = categories.find(cat => cat.id === categoryId);
    
    return availableBudgets.filter(budget => 
      !assignedBudgets.has(budget.title) || 
      (currentCategory && currentCategory.budgets.includes(budget.title))
    );
  };

  const handleMonthTransition = (envelopes: TransitionEnvelope[]) => {
    let success = true;
    
    try {
      // Appliquer les transitions pour chaque enveloppe
      envelopes.forEach(envelope => {
        const [categoryId, budgetTitle] = envelope.id.split("-");
        
        setCategories(prevCategories => {
          return prevCategories.map(category => {
            if (category.id === categoryId) {
              // Mise à jour des budgets selon l'option de transition
              const updatedBudgets = category.budgets.map(budget => {
                if (budget === budgetTitle) {
                  // Appliquer la transition selon l'option choisie
                  switch (envelope.transitionOption) {
                    case "reset":
                      return budget; // Pas de changement nécessaire
                    case "carry":
                      // La logique de report sera gérée dans le système de stockage des budgets
                      return budget;
                    case "partial":
                      // La logique de report partiel sera gérée dans le système de stockage des budgets
                      return budget;
                    case "transfer":
                      // La logique de transfert sera gérée dans le système de stockage des budgets
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
        });
      });

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
    categories,
    handleAssignBudget,
    handleRemoveBudget,
    updateCategoryName,
    getAvailableBudgetsForCategory,
    updateCategoryTotals,
    handleMonthTransition
  };
};
