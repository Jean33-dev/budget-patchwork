
import { useState, useEffect } from "react";
import { db, Income } from "@/services/database";
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
  } | null>(null);
  const [envelopes, setEnvelopes] = useState<Income[]>([]);

  useEffect(() => {
    const initializeData = async () => {
      await db.init();
      const incomes = await db.getIncomes();
      setEnvelopes(incomes);
    };
    
    initializeData();
  }, []);

  const handleAddIncome = async (newIncome: { 
    title: string; 
    budget: number; 
    type: "income"; 
    date: string 
  }): Promise<boolean> => {
    try {
      console.log("handleAddIncome - Tentative d'ajout avec montant:", newIncome.budget);
      
      // Assurez-vous que le budget est un nombre valide
      const budget = typeof newIncome.budget === 'number' && !isNaN(newIncome.budget) 
        ? newIncome.budget 
        : 0;

      const income = {
        id: Date.now().toString(),
        ...newIncome,
        budget: budget,
        spent: budget,
      };
      
      console.log("handleAddIncome - Revenu à ajouter:", income);
      const success = await db.addIncome(income);
      
      if (success) {
        setEnvelopes(prev => [...prev, income]);
        
        toast({
          title: "Succès",
          description: "Nouveau revenu ajouté",
        });
        
        return true;
      } else {
        throw new Error("Échec de l'ajout du revenu");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du revenu:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le revenu"
      });
      return false;
    }
  };

  const handleEditIncome = async (editedIncome: { 
    title: string; 
    budget: number; 
    type: "income"; 
    date: string 
  }): Promise<boolean> => {
    if (!selectedIncome) return false;

    try {
      // Assurez-vous que le budget est un nombre valide
      const budget = typeof editedIncome.budget === 'number' && !isNaN(editedIncome.budget) 
        ? editedIncome.budget 
        : 0;

      const updatedIncome = {
        ...selectedIncome,
        title: editedIncome.title,
        budget: budget,
        spent: budget,
        date: editedIncome.date,
      };

      console.log("handleEditIncome - Revenu à mettre à jour:", updatedIncome);
      const success = await db.updateIncome(updatedIncome);
      
      if (success) {
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
        
        return true;
      } else {
        throw new Error("Échec de la modification du revenu");
      }
    } catch (error) {
      console.error("Erreur lors de la modification du revenu:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le revenu"
      });
      return false;
    }
  };

  const handleDeleteIncome = async (incomeId: string): Promise<boolean> => {
    try {
      const success = await db.deleteIncome(incomeId);
      
      if (success) {
        setEnvelopes(prev => prev.filter(env => env.id !== incomeId));
        
        toast({
          title: "Succès",
          description: "Revenu supprimé",
        });
        return true;
      } else {
        throw new Error("Échec de la suppression du revenu");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du revenu:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le revenu"
      });
      return false;
    }
  };

  const handleIncomeClick = (envelope: Income) => {
    setSelectedIncome({
      id: envelope.id,
      title: envelope.title,
      budget: envelope.budget,
      type: envelope.type,
      date: envelope.date,
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
    handleIncomeClick
  };
};
