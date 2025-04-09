
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Income } from "@/services/database/models/income";

export const useRecurringIncome = () => {
  const { toast } = useToast();
  const [recurringIncomes, setRecurringIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    loadRecurringIncomes();
  }, []);

  const loadRecurringIncomes = async () => {
    setIsLoading(true);
    try {
      await db.init();
      const incomes = await db.getRecurringIncomes();
      setRecurringIncomes(incomes);
    } catch (error) {
      console.error("Erreur lors du chargement des revenus récurrents:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les revenus récurrents"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIncome = async (newIncome: { 
    title: string; 
    budget: number; 
    type: "income"; 
    date: string 
  }) => {
    try {
      const income = {
        id: Date.now().toString(),
        ...newIncome,
        spent: newIncome.budget,
        isRecurring: true
      };
      
      await db.addIncome(income);
      setRecurringIncomes(prev => [...prev, income]);
      
      toast({
        title: "Succès",
        description: "Nouveau revenu récurrent ajouté"
      });
      
      setAddDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du revenu récurrent:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le revenu récurrent"
      });
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      await db.deleteIncome(id);
      setRecurringIncomes(prev => prev.filter(income => income.id !== id));
      
      toast({
        title: "Succès",
        description: "Revenu récurrent supprimé"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du revenu récurrent:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le revenu récurrent"
      });
    }
  };

  return {
    recurringIncomes,
    isLoading,
    addDialogOpen,
    setAddDialogOpen,
    loadRecurringIncomes,
    handleAddIncome,
    handleDeleteIncome
  };
};
