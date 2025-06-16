
import { useState, useEffect } from "react";
import { Category } from "@/types/categories";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { useDashboardContext } from "./useDashboardContext";
import { useTheme } from "@/context/ThemeContext";

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
  const { currentDashboardId } = useDashboardContext();
  const { t } = useTheme();

  const loadCategories = async () => {
    try {
      console.log("Début du chargement des catégories pour le dashboard:", currentDashboardId);
      let dbCategories = await db.getCategories();
      console.log("Catégories chargées depuis la DB:", dbCategories);
      
      if (!dbCategories || dbCategories.length === 0) {
        console.log("Aucune catégorie trouvée, création des catégories par défaut...");
        for (const category of defaultCategories) {
          await db.addCategory({
            ...category,
            budgets: []
          });
        }
        dbCategories = defaultCategories;
      }

      // S'assurer que toutes les catégories ont les bonnes propriétés
      dbCategories = dbCategories.map(category => ({
        id: category.id,
        name: category.name,
        budgets: Array.isArray(category.budgets) ? category.budgets : [], // Assure que budgets est un tableau
        total: Number(category.total) || 0, // Assure que total est un nombre
        spent: Number(category.spent) || 0, // Assure que spent est un nombre
        description: category.description || ''
      }));
      
      console.log("Catégories finales après traitement pour le dashboard", currentDashboardId, ":", dbCategories);
      setCategories(dbCategories);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
      toast({
        variant: "destructive",
        title: t("categories.toast.errorTitle"),
        description: t("categories.toast.errorLoadBudgets")
      });
    }
  };

  // Charger les catégories au montage du composant ou quand le dashboardId change
  useEffect(() => {
    console.log("useEffect: Chargement des catégories pour le dashboard:", currentDashboardId);
    loadCategories();
  }, [currentDashboardId]);

  const refreshCategories = async () => {
    console.log("Début du rafraîchissement des catégories pour le dashboard:", currentDashboardId);
    await loadCategories();
    console.log("Rafraîchissement des catégories terminé");
  };

  const updateCategoryName = async (categoryId: string, newName: string) => {
    if (!newName.trim()) {
      toast({
        variant: "destructive",
        title: t("categories.toast.errorTitle"),
        description: t("categories.toast.categoryNameEmpty")
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
        name: newName
      };

      const updatedCategories = categories.map(cat =>
        cat.id === categoryId ? updatedCategory : cat
      );

      console.log("Mise à jour du nom de la catégorie:", updatedCategory);
      await db.updateCategory(updatedCategory);
      setCategories(updatedCategories);

      toast({
        title: t("categories.toast.categoryModified"),
        description: t("categories.toast.categoryModifiedDesc")
      });

      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom:", error);
      toast({
        variant: "destructive",
        title: t("categories.toast.errorTitle"),
        description: t("categories.toast.errorLoadBudgets")
      });
      return false;
    }
  };

  return {
    categories,
    updateCategoryName,
    setCategories,
    refreshCategories
  };
};
