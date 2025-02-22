
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
  const [isUpdating, setIsUpdating] = useState(false);

  const loadData = useCallback(async () => {
    if (isUpdating) {
      console.log("Une mise à jour est déjà en cours, chargement ignoré");
      return;
    }

    try {
      setIsLoading(true);
      setIsUpdating(true);
      
      // Initialisation de la base de données
      try {
        await db.init();
      } catch (error) {
        console.error("Erreur d'initialisation de la base de données:", error);
        throw new Error("Erreur d'initialisation de la base de données");
      }

      // Chargement des dépenses d'abord pour le calcul des totaux
      let expenses;
      try {
        expenses = await db.getExpenses();
        console.log("Dépenses chargées:", expenses);
      } catch (error) {
        console.error("Erreur lors du chargement des dépenses:", error);
        throw new Error("Impossible de charger les dépenses");
      }

      // Calcul du total des dépenses
      const totalSpent = expenses.reduce((sum, expense) => 
        sum + (Number(expense.budget) || 0), 0
      );
      setTotalExpenses(totalSpent);

      // Chargement des budgets
      let budgetsData;
      try {
        budgetsData = await db.getBudgets();
        console.log("Budgets chargés:", budgetsData);
      } catch (error) {
        console.error("Erreur lors du chargement des budgets:", error);
        throw new Error("Impossible de charger les budgets");
      }

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
      
      setBudgets(validatedBudgets);

      // Chargement des revenus
      let incomesData;
      try {
        incomesData = await db.getIncomes();
        console.log("Revenus chargés:", incomesData);
      } catch (error) {
        console.error("Erreur lors du chargement des revenus:", error);
        throw new Error("Impossible de charger les revenus");
      }

      // Calcul du total des revenus
      const totalIncome = incomesData.reduce((sum, income) => 
        sum + (Number(income.budget) || 0), 0
      );
      setTotalRevenues(totalIncome);
      
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur inattendue"
      });
    } finally {
      setIsLoading(false);
      setIsUpdating(false);
    }
  }, [isUpdating]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addBudget = async (newBudget: Omit<Budget, "id" | "spent">) => {
    if (isLoading || isUpdating) {
      console.log("Opération impossible pendant le chargement ou la mise à jour");
      return false;
    }
    
    try {
      setIsUpdating(true);
      
      const budgetToAdd: Budget = {
        id: Date.now().toString(),
        title: newBudget.title,
        budget: newBudget.budget,
        spent: 0,
        type: "budget"
      };

      await db.addBudget(budgetToAdd);
      console.log("Budget ajouté:", budgetToAdd);
      
      await loadData();
      
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
    } finally {
      setIsUpdating(false);
    }
  };

  const updateBudget = async (budgetToUpdate: Budget) => {
    if (isLoading || isUpdating) {
      console.log("Opération impossible pendant le chargement ou la mise à jour");
      return false;
    }
    
    try {
      setIsUpdating(true);
      
      await db.updateBudget(budgetToUpdate);
      console.log("Budget mis à jour:", budgetToUpdate);
      
      await loadData();
      
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
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteBudget = async (budgetId: string) => {
    if (isLoading || isUpdating) {
      console.log("Opération impossible pendant le chargement ou la mise à jour");
      return false;
    }
    
    try {
      setIsUpdating(true);
      
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

      await db.deleteBudget(budgetId);
      console.log("Budget supprimé:", budgetId);
      
      await loadData();
      
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
    } finally {
      setIsUpdating(false);
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
