
import { useState } from "react";
import { Category, Budget } from "@/types/categories";
import { useToast } from "@/hooks/use-toast";

export const useCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
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
  ]);

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

  return {
    categories,
    handleAssignBudget,
    handleRemoveBudget,
    updateCategoryName,
    getAvailableBudgetsForCategory,
    updateCategoryTotals
  };
};
