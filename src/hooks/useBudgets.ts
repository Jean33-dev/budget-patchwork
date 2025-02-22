
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";

export type Budget = {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "budget";
};

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [totalRevenues, setTotalRevenues] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      console.log("Début du chargement des données");
      
      // Initialisation de la base de données
      await db.init();
      console.log("Base de données initialisée");

      // Récupération de toutes les données en parallèle
      const [expenses, budgetsData, incomesData] = await Promise.all([
        db.getExpenses(),
        db.getBudgets(),
        db.getIncomes()
      ]);
      console.log("Données récupérées:", { expenses, budgetsData, incomesData });

      // Calcul des totaux
      const totalIncome = incomesData.reduce((sum, income) => 
        sum + (Number(income.budget) || 0), 0
      );
      setTotalRevenues(totalIncome);

      const totalSpent = expenses.reduce((sum, expense) => 
        sum + (Number(expense.budget) || 0), 0
      );
      setTotalExpenses(totalSpent);

      // Calcul des dépenses par budget
      const validatedBudgets = budgetsData.map(budget => {
        const budgetExpenses = expenses.filter(expense => 
          expense.linkedBudgetId === budget.id
        );
        const budgetSpent = budgetExpenses.reduce((sum, expense) => 
          sum + (Number(expense.budget) || 0), 0
        );
        
        return {
          ...budget,
          budget: Number(budget.budget) || 0,
          spent: budgetSpent
        };
      });
      
      console.log("Budgets validés:", validatedBudgets);
      setBudgets(validatedBudgets);
      setIsLoading(false);
      
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur inattendue"
      });
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addBudget = async (newBudget: Omit<Budget, "id" | "spent">) => {
    try {
      const budgetToAdd: Budget = {
        id: Date.now().toString(),
        title: newBudget.title,
        budget: newBudget.budget,
        spent: 0,
        type: "budget"
      };

      await db.addBudget(budgetToAdd);
      // Mettre à jour l'état local immédiatement
      setBudgets(currentBudgets => [...currentBudgets, budgetToAdd]);
      await loadData(); // Recharger pour avoir les données à jour
      
      toast({
        title: "Budget ajouté",
        description: `Le budget "${newBudget.title}" a été créé avec succès.`
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le budget"
      });
      return false;
    }
  };

  const updateBudget = async (budgetToUpdate: Budget) => {
    try {
      await db.updateBudget(budgetToUpdate);
      // Mettre à jour l'état local immédiatement
      setBudgets(currentBudgets => 
        currentBudgets.map(budget => 
          budget.id === budgetToUpdate.id ? budgetToUpdate : budget
        )
      );
      await loadData(); // Recharger pour avoir les données à jour
      
      toast({
        title: "Budget modifié",
        description: `Le budget "${budgetToUpdate.title}" a été mis à jour.`
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de la modification du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le budget"
      });
      return false;
    }
  };

  const deleteBudget = async (budgetId: string) => {
    try {
      const expenses = await db.getExpenses();
      const hasLinkedExpenses = expenses.some(expense => 
        expense.linkedBudgetId === budgetId
      );
      
      if (hasLinkedExpenses) {
        toast({
          variant: "destructive",
          title: "Suppression impossible",
          description: "Ce budget a des dépenses qui lui sont affectées."
        });
        return false;
      }

      // Supprimer d'abord de la base de données
      await db.deleteBudget(budgetId);
      
      // Mettre à jour l'état local immédiatement
      setBudgets(currentBudgets => 
        currentBudgets.filter(budget => budget.id !== budgetId)
      );
      
      // Recharger les données en arrière-plan
      loadData();
      
      toast({
        title: "Budget supprimé",
        description: "Le budget a été supprimé avec succès."
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du budget:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le budget"
      });
      return false;
    }
  };

  const totalBudgets = budgets.reduce((sum, budget) => sum + budget.budget, 0);
  const remainingAmount = totalRevenues - totalBudgets;

  return {
    budgets,
    totalRevenues,
    totalBudgets,
    totalExpenses,
    remainingAmount,
    addBudget,
    updateBudget,
    deleteBudget,
    refreshData: loadData,
    isLoading
  };
};
