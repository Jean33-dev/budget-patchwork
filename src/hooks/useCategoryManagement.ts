
import { useState, useEffect } from "react";
import { Category } from "@/types/categories";
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

export const useCategoryManagement = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log("Chargement des catégories...");
        let dbCategories = await db.getCategories();
        console.log("Catégories chargées:", dbCategories);
        
        if (!dbCategories || dbCategories.length === 0) {
          console.log("Création des catégories par défaut...");
          for (const category of defaultCategories) {
            await db.addCategory({
              ...category,
              budgets: [] // S'assurer que budgets est un tableau vide
            });
          }
          dbCategories = defaultCategories;
        }

        // S'assurer que toutes les catégories ont un tableau budgets valide
        dbCategories = dbCategories.map(category => ({
          ...category,
          budgets: Array.isArray(category.budgets) ? category.budgets : []
        }));
        
        console.log("Catégories finales:", dbCategories);
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
      const categoryToUpdate = categories.find(cat => cat.id === categoryId);
      if (!categoryToUpdate) {
        throw new Error("Catégorie non trouvée");
      }

      const updatedCategory: Category = {
        ...categoryToUpdate,
        name: newName,
        budgets: Array.isArray(categoryToUpdate.budgets) ? categoryToUpdate.budgets : []
      };

      const updatedCategories = categories.map(cat =>
        cat.id === categoryId ? updatedCategory : cat
      );

      await db.updateCategory(updatedCategory);
      setCategories(updatedCategories);

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

  return {
    categories,
    updateCategoryName,
    setCategories
  };
};
