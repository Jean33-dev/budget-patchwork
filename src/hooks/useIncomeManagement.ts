
import { useState, useEffect } from "react";
import { db } from "@/services/database";
import { Income } from "@/services/database/models/income";
import { useToast } from "@/hooks/use-toast";

export const useIncomeManagement = () => {
  const { toast } = useToast();
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
  const [envelopes, setEnvelopes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialiser la base de données et charger les revenus
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await db.init();
        const incomes = await db.getIncomes();
        setEnvelopes(incomes);
      } catch (error) {
        console.error("Erreur lors du chargement des revenus:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les revenus"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, [toast]);

  const handleAddIncome = async (newIncome: { title: string; budget: number; type: "income"; date: string }) => {
    const income = {
      id: Date.now().toString(),
      ...newIncome,
      spent: newIncome.budget,
      isRecurring: false // Non récurrent par défaut
    };
    
    await db.addIncome(income);
    setEnvelopes(prev => [...prev, income]);
    
    toast({
      title: "Succès",
      description: "Nouveau revenu ajouté",
    });
  };

  const handleEditIncome = async (editedIncome: { title: string; budget: number; type: "income"; date: string }) => {
    if (!selectedIncome) return;

    const updatedIncome = {
      ...selectedIncome,
      title: editedIncome.title,
      budget: editedIncome.budget,
      spent: editedIncome.budget,
      date: editedIncome.date,
    };

    await db.updateIncome(updatedIncome);
    setEnvelopes(prev => prev.map(env => 
      env.id === selectedIncome.id 
        ? updatedIncome
        : env
    ));

    setEditDialogOpen(false);
    setSelectedIncome(null);
    
    toast({
      title: "Succès",
      description: "Revenu modifié",
    });
  };

  const handleDeleteIncome = async (incomeId: string) => {
    await db.deleteIncome(incomeId);
    setEnvelopes(prev => prev.filter(env => env.id !== incomeId));
    
    toast({
      title: "Succès",
      description: "Revenu supprimé",
    });
  };

  const handleIncomeClick = (envelope: Income) => {
    setSelectedIncome({
      id: envelope.id,
      title: envelope.title,
      budget: envelope.budget,
      type: envelope.type,
      date: envelope.date,
      isRecurring: envelope.isRecurring
    });
    setEditDialogOpen(true);
  };

  return {
    envelopes,
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    selectedIncome,
    setSelectedIncome,
    handleAddIncome,
    handleEditIncome,
    handleDeleteIncome,
    handleIncomeClick,
    isLoading
  };
};
