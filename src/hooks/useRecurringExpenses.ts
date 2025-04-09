
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/services/database/models/budget";

export const useRecurringExpenses = () => {
  const { toast } = useToast();
  const [recurringExpenses, setRecurringExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentDate = format(new Date(), "yyyy-MM-dd");

  const loadData = async () => {
    setIsLoading(true);
    try {
      await db.init();
      const expenses = await db.getRecurringExpenses();
      const budgets = await db.getBudgets();
      setRecurringExpenses(expenses);
      setAvailableBudgets(budgets);
    } catch (error) {
      console.error("Erreur lors du chargement des dépenses récurrentes:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les dépenses récurrentes"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddExpense = async (newExpense: { 
    title: string; 
    budget: number; 
    type: "expense";
    linkedBudgetId?: string;
    date: string;
  }) => {
    try {
      const expense = {
        id: Date.now().toString(),
        ...newExpense,
        spent: 0,
        isRecurring: true
      };
      
      await db.addExpense(expense);
      setRecurringExpenses(prev => [...prev, expense]);
      
      toast({
        title: "Succès",
        description: "Nouvelle dépense récurrente ajoutée"
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la dépense récurrente:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la dépense récurrente"
      });
      return false;
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await db.deleteExpense(id);
      setRecurringExpenses(prev => prev.filter(expense => expense.id !== id));
      
      toast({
        title: "Succès",
        description: "Dépense récurrente supprimée"
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense récurrente:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense récurrente"
      });
      return false;
    }
  };

  const getBudgetName = (budgetId?: string) => {
    if (!budgetId) return "Aucun budget";
    const budget = availableBudgets.find(b => b.id === budgetId);
    return budget ? budget.title : "Budget inconnu";
  };

  return {
    recurringExpenses,
    availableBudgets,
    isLoading,
    loadData,
    handleAddExpense,
    handleDeleteExpense,
    getBudgetName,
    currentDate,
  };
};
