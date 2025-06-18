
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Income } from "@/services/database/models/income";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { incomeOperations, IncomeFormData } from "@/utils/income-operations";

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
  const { currentDashboardId } = useDashboardContext();

  useEffect(() => {
    loadRecurringIncomes();
  }, [currentDashboardId]);

  const loadRecurringIncomes = async () => {
    setIsLoading(true);
    try {
      await db.init();
      const allIncomes = await db.getRecurringIncomes();
      
      // Filtrer par dashboardId
      const filteredIncomes = allIncomes.filter(income => {
        const incomeDashboardId = income.dashboardId ? String(income.dashboardId) : "";
        const currentDashId = String(currentDashboardId || "");
        const match = incomeDashboardId === currentDashId;
        
        console.log(`🔍 Recurring Income filter: "${income.title}" (${incomeDashboardId || 'null'}) vs current "${currentDashId}" = ${match}`);
        return match;
      });
      
      setRecurringIncomes(filteredIncomes);
      console.log("useRecurringIncome - Filtered recurring incomes:", filteredIncomes.length);
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
    type: "income" | "expense" | "budget"; 
    date: string;
    isRecurring?: boolean;
  }) => {
    try {
      if (newIncome.type !== "income") {
        throw new Error("Type must be 'income'");
      }
      
      if (!currentDashboardId) {
        console.error("useRecurringIncome - Aucun dashboardId trouvé pour l'ajout d'un revenu récurrent");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'ajouter le revenu: ID du tableau de bord manquant"
        });
        return;
      }
      
      const incomeData: IncomeFormData = {
        title: newIncome.title,
        budget: newIncome.budget,
        type: "income",
        date: newIncome.date,
        isRecurring: true,
        dashboardId: currentDashboardId
      };
      
      const success = await incomeOperations.addIncome(incomeData);
      
      if (success) {
        await loadRecurringIncomes(); // Recharger pour obtenir la liste à jour
        
        toast({
          title: "Succès",
          description: "Nouveau revenu récurrent ajouté"
        });
        
        setAddDialogOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'ajouter le revenu récurrent"
        });
      }
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
    if (!currentDashboardId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "ID du tableau de bord manquant"
      });
      return;
    }

    try {
      const updatedIncome: Income = {
        id: selectedIncome.id,
        title: editedIncome.title,
        budget: editedIncome.budget,
        spent: editedIncome.budget,
        type: "income",
        date: editedIncome.date,
        isRecurring: true,
        dashboardId: currentDashboardId
      };

      const success = await incomeOperations.updateIncome(updatedIncome);
      
      if (success) {
        await loadRecurringIncomes(); // Recharger pour obtenir la liste à jour
        
        setEditDialogOpen(false);
        setSelectedIncome(null);
        
        toast({
          title: "Succès",
          description: "Revenu récurrent modifié"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de modifier le revenu récurrent"
        });
      }
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
      const success = await incomeOperations.deleteIncome(id);
      
      if (success) {
        setRecurringIncomes(prev => prev.filter(income => income.id !== id));
        
        toast({
          title: "Succès",
          description: "Revenu récurrent supprimé"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer le revenu récurrent"
        });
      }
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
