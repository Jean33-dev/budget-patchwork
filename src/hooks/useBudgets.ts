
import { useState, useEffect, useCallback, useRef } from "react";
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
  const isInitialized = useRef(false);
  const isMounted = useRef(true);

  // Fonction d'initialisation de la base de données
  const initDatabase = useCallback(async () => {
    if (!isInitialized.current) {
      await db.init();
      isInitialized.current = true;
    }
  }, []);

  // Fonction de chargement des données
  const loadData = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      await initDatabase();

      const [expenses, budgetsData, incomesData] = await Promise.all([
        db.getExpenses(),
        db.getBudgets(),
        db.getIncomes()
      ]);
      
      if (!isMounted.current) return;

      const totalIncome = incomesData.reduce((sum, income) => 
        sum + (Number(income.budget) || 0), 0
      );
      
      const totalSpent = expenses.reduce((sum, expense) => 
        sum + (Number(expense.budget) || 0), 0
      );

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

      if (!isMounted.current) return;

      setTotalRevenues(totalIncome);
      setTotalExpenses(totalSpent);
      setBudgets(validatedBudgets);
      
    } catch (error) {
      if (!isMounted.current) return;
      console.error("Erreur lors du chargement des données:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur inattendue"
      });
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Effet de nettoyage
  useEffect(() => {
    isMounted.current = true;
    loadData();
    return () => {
      isMounted.current = false;
    };
  }, [loadData]);

  const addBudget = useCallback(async (newBudget: Omit<Budget, "id" | "spent">) => {
    try {
      const budgetToAdd: Budget = {
        id: Date.now().toString(),
        title: newBudget.title,
        budget: newBudget.budget,
        spent: 0,
        type: "budget"
      };

      await db.addBudget(budgetToAdd);
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
  }, [loadData]);

  const updateBudget = useCallback(async (budgetToUpdate: Budget) => {
    try {
      await db.updateBudget(budgetToUpdate);
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
  }, [loadData]);

  const deleteBudget = useCallback(async (budgetId: string) => {
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
  }, [loadData]);

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
