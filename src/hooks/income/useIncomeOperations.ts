
import { useToast } from "@/hooks/use-toast";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { incomeOperations, IncomeFormData } from "@/utils/income-operations";
import { Income } from "@/services/database/models/income";

export const useIncomeOperations = (refreshIncomes: () => Promise<void>) => {
  const { toast } = useToast();
  const { currentDashboardId } = useDashboardContext();

  const handleAddIncome = async (newIncome: { title: string; budget: number; type: "income"; date: string }) => {
    try {
      if (!currentDashboardId) {
        console.error("useIncomeOperations - Aucun dashboardId trouvé pour l'ajout d'un revenu");
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
    
      console.log("useIncomeOperations - Adding new income with dashboardId:", incomeData.dashboardId);
      const success = await incomeOperations.addIncome(incomeData);
      
      if (success) {
        await refreshIncomes();
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

  const handleEditIncome = async (editedIncome: { title: string; budget: number; type: "income"; date: string }, selectedIncome: { id: string; isRecurring?: boolean } | null) => {
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
        await refreshIncomes();
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
        await refreshIncomes();
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

  return {
    handleAddIncome,
    handleEditIncome,
    handleDeleteIncome
  };
};
