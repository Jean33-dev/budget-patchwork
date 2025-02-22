
import { useState, useEffect } from "react";
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

  const loadData = async () => {
    try {
      // Chargement des budgets
      const budgetsData = await db.getBudgets();
      
      // Chargement des dépenses
      const expenses = await db.getExpenses();
      console.log("Dépenses totales chargées:", expenses);
      
      // Calcul du total des dépenses
      const totalSpent = expenses.reduce((sum, expense) => 
        sum + (Number(expense.budget) || 0), 0
      );
      setTotalExpenses(totalSpent);
      
      // Mise à jour des budgets avec leurs dépenses associées
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
      console.log("Budgets mis à jour avec dépenses:", validatedBudgets);

      // Chargement et calcul des revenus
      const incomesData = await db.getIncomes();
      const totalIncome = incomesData.reduce((sum, income) => 
        sum + (Number(income.budget) || 0), 0
      );
      
      setTotalRevenues(totalIncome);
      console.log("Revenus totaux calculés:", totalIncome);
      
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données"
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
      console.log("Budget ajouté dans la base de données:", budgetToAdd);
      
      // Recharger toutes les données pour maintenir la cohérence
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
    }
  };

  const updateBudget = async (budgetToUpdate: Budget) => {
    try {
      await db.updateBudget(budgetToUpdate);
      console.log("Budget mis à jour dans la base de données:", budgetToUpdate);
      
      // Recharger toutes les données pour maintenir la cohérence
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
    }
  };

  const deleteBudget = async (budgetId: string) => {
    try {
      console.log("Début de la suppression du budget", budgetId);
      const expenses = await db.getExpenses();
      console.log("Dépenses récupérées:", expenses);
      
      const hasLinkedExpenses = expenses.some(expense => 
        expense.linkedBudgetId === budgetId
      );
      
      console.log("Le budget a-t-il des dépenses liées ?", hasLinkedExpenses);
      
      if (hasLinkedExpenses) {
        toast({
          variant: "destructive",
          title: "Suppression impossible",
          description: "Ce budget a des dépenses qui lui sont affectées."
        });
        return false;
      }

      await db.deleteBudget(budgetId);
      console.log("Budget supprimé de la base de données:", budgetId);
      
      // Recharger toutes les données pour maintenir la cohérence
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
    refreshData: loadData
  };
};
