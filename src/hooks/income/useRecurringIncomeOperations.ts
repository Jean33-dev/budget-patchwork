
import { useToast } from "@/hooks/use-toast";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { incomeOperations, IncomeFormData } from "@/utils/income-operations";
import { Income } from "@/services/database/models/income";

export const useRecurringIncomeOperations = (
  loadRecurringIncomes: () => Promise<void>,
  setAddDialogOpen: (open: boolean) => void,
  setEditDialogOpen: (open: boolean) => void,
  setSelectedIncome: (income: any) => void,
  setRecurringIncomes: React.Dispatch<React.SetStateAction<Income[]>>
) => {
  const { toast } = useToast();
  const { currentDashboardId } = useDashboardContext();

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
        console.error("useRecurringIncomeOperations - Aucun dashboardId trouvé pour l'ajout d'un revenu récurrent");
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
  }, selectedIncome: any) => {
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

  return {
    handleAddIncome,
    handleEditIncome,
    handleDeleteIncome
  };
};
