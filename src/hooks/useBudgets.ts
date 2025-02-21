
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log("Chargement des budgets et revenus...");
      const budgetsData = await db.getBudgets();
      console.log("Budgets chargés:", budgetsData);
      
      const expenses = await db.getExpenses();
      console.log("Dépenses chargées:", expenses);
      
      const validatedBudgets = budgetsData.map(budget => {
        const budgetExpenses = expenses.filter(expense => expense.linkedBudgetId === budget.id);
        const totalSpent = budgetExpenses.reduce((sum, expense) => sum + (Number(expense.budget) || 0), 0);
        
        return {
          ...budget,
          budget: Number(budget.budget) || 0,
          spent: totalSpent
        };
      });
      
      setBudgets(validatedBudgets);
      console.log("Budgets validés avec dépenses:", validatedBudgets);

      const incomesData = await db.getIncomes();
      console.log("Revenus chargés:", incomesData);
      
      const totalIncome = incomesData.reduce((sum, income) => {
        const budgetAmount = Number(income.budget) || 0;
        return sum + budgetAmount;
      }, 0);
      
      setTotalRevenues(totalIncome);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données"
      });
    }
  };

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
      setBudgets([...budgets, budgetToAdd]);
      
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
      setBudgets(budgets.map(b => b.id === budgetToUpdate.id ? budgetToUpdate : b));
      
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
      const hasLinkedExpenses = expenses.some(expense => expense.linkedBudgetId === budgetId);
      
      if (hasLinkedExpenses) {
        toast({
          variant: "destructive",
          title: "Suppression impossible",
          description: "Ce budget a des dépenses qui lui sont affectées."
        });
        return false;
      }

      await db.deleteBudget(budgetId);
      setBudgets(budgets.filter(b => b.id !== budgetId));
      
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
    remainingAmount,
    addBudget,
    updateBudget,
    deleteBudget
  };
};
