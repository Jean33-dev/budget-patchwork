
import { useState, useEffect } from "react";
import { Category, Budget } from "@/types/categories";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";

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
  const [categories, setCategories] = useState<Category[]>([]);

  // Charger les catégories depuis SQLite
  useEffect(() => {
    const loadCategories = async () => {
      try {
        let dbCategories = await db.getCategories();
        
        // Si aucune catégorie n'existe, initialiser avec les catégories par défaut
        if (dbCategories.length === 0) {
          for (const category of defaultCategories) {
            await db.addCategory(category);
          }
          dbCategories = defaultCategories;
        }
        
        setCategories(dbCategories);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les catégories"
        });
      }
    };

    loadCategories();
  }, [toast]);

  const getAssignedBudgets = () => {
    const assignedBudgets = new Set<string>();
    categories.forEach(category => {
      category.budgets.forEach(budget => {
        assignedBudgets.add(budget);
      });
    });
    return assignedBudgets;
  };

  const updateCategoryTotals = async (categoryId: string, availableBudgets: Budget[]) => {
    try {
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          const total = category.budgets.reduce((sum, budgetTitle) => {
            const budget = availableBudgets.find(b => b.title === budgetTitle);
            return sum + (budget?.budget || 0);
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

      setCategories(updatedCategories);
      
      // Mettre à jour la catégorie dans SQLite
      const updatedCategory = updatedCategories.find(c => c.id === categoryId);
      if (updatedCategory) {
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

      const updatedCategories = categories.map(category => {
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

      setCategories(updatedCategories);
      
      // Mettre à jour la catégorie dans SQLite
      const updatedCategory = updatedCategories.find(c => c.id === categoryId);
      if (updatedCategory) {
        await db.updateCategory(updatedCategory);
      }

      await updateCategoryTotals(categoryId, availableBudgets);

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
    }
  };

  const handleRemoveBudget = async (categoryId: string, budgetTitle: string) => {
    try {
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            budgets: category.budgets.filter(b => b !== budgetTitle)
          };
        }
        return category;
      });

      setCategories(updatedCategories);
      
      // Mettre à jour la catégorie dans SQLite
      const updatedCategory = updatedCategories.find(c => c.id === categoryId);
      if (updatedCategory) {
        await db.updateCategory(updatedCategory);
      }

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
    }
  };

  const updateCategoryName = async (categoryId: string, newName: string) => {
    if (!newName.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de la catégorie ne peut pas être vide."
      });
      return false;
    }

    try {
      const updatedCategories = categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, name: newName }
          : cat
      );

      setCategories(updatedCategories);
      
      // Mettre à jour la catégorie dans SQLite
      const updatedCategory = updatedCategories.find(c => c.id === categoryId);
      if (updatedCategory) {
        await db.updateCategory(updatedCategory);
      }

      toast({
        title: "Catégorie modifiée",
        description: "La catégorie a été modifiée avec succès."
      });

      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le nom de la catégorie"
      });
      return false;
    }
  };

  const getAvailableBudgetsForCategory = (categoryId: string, availableBudgets: Budget[]) => {
    const assignedBudgets = getAssignedBudgets();
    const currentCategory = categories.find(cat => cat.id === categoryId);
    
    return availableBudgets.filter(budget => 
      !assignedBudgets.has(budget.title) || 
      (currentCategory && currentCategory.budgets.includes(budget.title))
    );
  };

  const handleMonthTransition = async (envelopes: TransitionEnvelope[]) => {
    let success = true;
    
    try {
      // Appliquer les transitions pour chaque enveloppe
      for (const envelope of envelopes) {
        const [categoryId, budgetTitle] = envelope.id.split("-");
        
        const updatedCategories = categories.map(category => {
          if (category.id === categoryId) {
            // Mise à jour des budgets selon l'option de transition
            const updatedBudgets = category.budgets.map(budget => {
              if (budget === budgetTitle) {
                // Appliquer la transition selon l'option choisie
                switch (envelope.transitionOption) {
                  case "reset":
                    return budget;
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

        setCategories(updatedCategories);
        
        // Mettre à jour la catégorie dans SQLite
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
    categories,
    handleAssignBudget,
    handleRemoveBudget,
    updateCategoryName,
    getAvailableBudgetsForCategory,
    updateCategoryTotals,
    handleMonthTransition
  };
};
