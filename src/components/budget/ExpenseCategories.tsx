import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export type ExpenseCategory = {
  id: string;
  name: string;
};

const DEFAULT_CATEGORIES: ExpenseCategory[] = [];

export const useExpenseCategories = () => {
  const [categories, setCategories] = useState<ExpenseCategory[]>(DEFAULT_CATEGORIES);
  const { toast } = useToast();

  const addCategory = (name: string) => {
    if (name.trim() === "") {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie ne peut pas être vide",
        variant: "destructive",
      });
      return;
    }

    if (categories.some((cat) => cat.name.toLowerCase() === name.toLowerCase())) {
      toast({
        title: "Erreur",
        description: "Cette catégorie existe déjà",
        variant: "destructive",
      });
      return;
    }

    const newCategory: ExpenseCategory = {
      id: Date.now().toString(),
      name: name.trim(),
    };

    setCategories([...categories, newCategory]);
    toast({
      title: "Succès",
      description: "Nouvelle catégorie ajoutée",
    });
  };

  return {
    categories,
    addCategory,
  };
};