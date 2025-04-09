
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Income } from "@/services/database/models/income";

export const useRecurringIncome = () => {
  const { toast } = useToast();
  const [recurringIncomes, setRecurringIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<{
    id: string;
    title: string;
    budget: number;
    type: "income";
    date: string;
    isRecurring?: boolean;
  } | null>(null);

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

  const handleEditIncome = async (editedIncome: { 
    title: string; 
    budget: number; 
    type: "income"; 
    date: string 
  }) => {
    if (!selectedIncome) return;

    try {
      const updatedIncome = {
        ...selectedIncome,
        title: editedIncome.title,
        budget: editedIncome.budget,
        spent: editedIncome.budget,
        date: editedIncome.date,
        isRecurring: true
      };

      await db.updateIncome(updatedIncome);
      setRecurringIncomes(prev => prev.map(income => 
        income.id === selectedIncome.id 
          ? { ...income, ...updatedIncome }
          : income
      ));

      setEditDialogOpen(false);
      setSelectedIncome(null);
      
      toast({
        title: "Succès",
        description: "Revenu récurrent modifié"
      });
    } catch (error) {
      console.error("Erreur lors de la modification du revenu récurrent:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le revenu récurrent"
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

  const handleIncomeClick = (income: Income) => {
    setSelectedIncome({
      id: income.id,
      title: income.title,
      budget: income.budget,
      type: income.type,
      date: income.date,
      isRecurring: income.isRecurring
    });
    setEditDialogOpen(true);
  };

  return {
    recurringIncomes,
    isLoading,
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    selectedIncome,
    setSelectedIncome,
    loadRecurringIncomes,
    handleAddIncome,
    handleEditIncome,
    handleDeleteIncome,
    handleIncomeClick
  };
};
