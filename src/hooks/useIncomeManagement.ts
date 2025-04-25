
import { useState, useEffect } from "react";
import { db } from "@/services/database";
import { Income } from "@/services/database/models/income";
import { useToast } from "@/hooks/use-toast";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { incomeOperations, IncomeFormData } from "@/utils/income-operations";

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
  const { currentDashboardId } = useDashboardContext();

  // Initialize the database and load incomes
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await db.init();
        const allIncomes = await db.getIncomes();
        
        console.log("useIncomeManagement - All incomes loaded:", allIncomes);
        console.log("useIncomeManagement - Current dashboardId:", currentDashboardId);
        
        // Filter incomes for the current dashboard with strict string comparison
        const filteredIncomes = allIncomes.filter(income => {
          // Normaliser les deux dashboardIds en strings
          const incomeDashboardId = income.dashboardId ? String(income.dashboardId) : "";
          const currentDashId = String(currentDashboardId || "");
          const match = incomeDashboardId === currentDashId;
          
          console.log(`🔍 Income filter: "${income.title}" (${incomeDashboardId || 'null'}) vs current "${currentDashId}" = ${match}`);
          return match;
        });
        
        console.log("useIncomeManagement - Filtered incomes:", filteredIncomes);
        setEnvelopes(filteredIncomes);
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
  }, [toast, currentDashboardId]);

  const handleAddIncome = async (newIncome: { title: string; budget: number; type: "income"; date: string }) => {
    try {
      if (!currentDashboardId) {
        console.error("useIncomeManagement - Aucun dashboardId trouvé pour l'ajout d'un revenu");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'ajouter le revenu: ID du tableau de bord manquant"
        });
        return;
      }
      
      const incomeData: IncomeFormData = {
        ...newIncome,
        dashboardId: currentDashboardId,
        isRecurring: false
      };
    
      console.log("useIncomeManagement - Adding new income with dashboardId:", incomeData.dashboardId);
      const success = await incomeOperations.addIncome(incomeData);
      
      if (success) {
        // Recharger les données pour obtenir l'ID correct et autres détails
        const allIncomes = await db.getIncomes();
        const filteredIncomes = allIncomes.filter(income => 
          String(income.dashboardId || "") === String(currentDashboardId || "")
        );
        setEnvelopes(filteredIncomes);
        
        toast({
          title: "Succès",
          description: "Nouveau revenu ajouté",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'ajouter le revenu"
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du revenu:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du revenu"
      });
    }
  };

  const handleEditIncome = async (editedIncome: { title: string; budget: number; type: "income"; date: string }) => {
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
        isRecurring: selectedIncome.isRecurring,
        dashboardId: currentDashboardId
      };

      const success = await incomeOperations.updateIncome(updatedIncome);
      
      if (success) {
        // Recharger les données pour s'assurer d'avoir les données à jour
        const allIncomes = await db.getIncomes();
        const filteredIncomes = allIncomes.filter(income => 
          String(income.dashboardId || "") === String(currentDashboardId || "")
        );
        setEnvelopes(filteredIncomes);
        
        setEditDialogOpen(false);
        setSelectedIncome(null);
        
        toast({
          title: "Succès",
          description: "Revenu modifié",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de modifier le revenu"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la modification du revenu:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du revenu"
      });
    }
  };

  const handleDeleteIncome = async (incomeId: string) => {
    try {
      const success = await incomeOperations.deleteIncome(incomeId);
      
      if (success) {
        setEnvelopes(prev => prev.filter(env => env.id !== incomeId));
        
        toast({
          title: "Succès",
          description: "Revenu supprimé",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer le revenu"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du revenu:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du revenu"
      });
    }
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
