
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/database";

export type Budget = {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "budget";
  carriedOver?: number;
};

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [totalRevenues, setTotalRevenues] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Loading budget data...");
      
      // Force database initialization
      const dbInitialized = await db.init();
      
      if (!dbInitialized) {
        throw new Error("Failed to initialize database");
      }
      
      console.log("Database initialized, loading budgets...");
      
      // Load budgets
      const budgetsData = await db.getBudgets();
      console.log("Budgets loaded:", budgetsData);
      
      // Load expenses
      const expenses = await db.getExpenses();
      console.log("Total expenses loaded:", expenses);
      
      // Calculate total expenses
      const totalSpent = expenses.reduce((sum, expense) => 
        sum + (Number(expense.budget) || 0), 0
      );
      setTotalExpenses(totalSpent);
      
      // Update budgets with their associated expenses
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
          spent: budgetSpent,
          carriedOver: budget.carriedOver || 0
        };
      });
      
      setBudgets(validatedBudgets);
      console.log("Budgets updated with expenses:", validatedBudgets);

      // Load and calculate incomes
      const incomesData = await db.getIncomes();
      const totalIncome = incomesData.reduce((sum, income) => 
        sum + (Number(income.budget) || 0), 0
      );
      
      setTotalRevenues(totalIncome);
      console.log("Total revenues calculated:", totalIncome);
      
    } catch (error) {
      console.error("Error loading data:", error);
      setError(error instanceof Error ? error : new Error("Unknown error"));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to load data"
      });
    } finally {
      setIsLoading(false);
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

      console.log("Ajout d'un nouveau budget:", budgetToAdd);
      await db.addBudget(budgetToAdd);
      
      // Mise à jour de l'état local
      setBudgets(prevBudgets => [...prevBudgets, budgetToAdd]);
      
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
      setBudgets(prevBudgets => 
        prevBudgets.map(b => b.id === budgetToUpdate.id ? budgetToUpdate : b)
      );
      
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

      await db.deleteBudget(budgetId);
      setBudgets(prevBudgets => prevBudgets.filter(b => b.id !== budgetId));
      
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
    isLoading,
    error,
    addBudget,
    updateBudget: (budget: Budget) => updateBudget(budget),
    deleteBudget: (id: string) => deleteBudget(id),
    refreshData: loadData
  };
};
