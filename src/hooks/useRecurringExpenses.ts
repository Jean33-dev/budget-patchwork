
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/services/database/models/budget";
import { useParams } from "react-router-dom";

export const useRecurringExpenses = () => {
  const { toast } = useToast();
  const [recurringExpenses, setRecurringExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentDate = format(new Date(), "yyyy-MM-dd");
  const { dashboardId = "default" } = useParams<{ dashboardId: string }>();

  const loadData = async () => {
    setIsLoading(true);
    try {
      await db.init();
      const expenses = await db.getRecurringExpenses();
      const budgets = await db.getBudgets();
      
      // Filter by dashboardId
      const filteredExpenses = expenses.filter(expense => 
        expense.dashboardId === dashboardId || !expense.dashboardId
      );
      const filteredBudgets = budgets.filter(budget => 
        budget.dashboardId === dashboardId || !budget.dashboardId
      );
      
      setRecurringExpenses(filteredExpenses);
      setAvailableBudgets(filteredBudgets);
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
  }, [dashboardId]);

  const handleAddExpense = async (newExpense: { 
    title: string; 
    budget: number; 
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date: string;
    isRecurring?: boolean;
  }) => {
    try {
      if (newExpense.type !== "expense") {
        throw new Error("Type must be 'expense'");
      }
      
      const expense: Expense = {
        id: Date.now().toString(),
        ...newExpense,
        type: "expense",
        spent: 0,
        linkedBudgetId: newExpense.linkedBudgetId || null,
        isRecurring: true,
        dashboardId
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

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      // Ensure the expense is still recurring and has the correct dashboardId
      const expense: Expense = {
        ...updatedExpense,
        type: "expense",
        isRecurring: true,
        linkedBudgetId: updatedExpense.linkedBudgetId || null,
        dashboardId: updatedExpense.dashboardId || dashboardId
      };
      
      await db.updateExpense(expense);
      
      // Update the local state
      setRecurringExpenses(prev => 
        prev.map(item => item.id === expense.id ? expense : item)
      );
      
      toast({
        title: "Succès",
        description: "Dépense récurrente mise à jour"
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la dépense récurrente:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la dépense récurrente"
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

  const handleAddToCurrentMonth = async (id: string) => {
    try {
      await db.copyRecurringExpenseToMonth(id, currentDate);
      
      toast({
        title: "Succès",
        description: "Dépense ajoutée au mois courant"
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la dépense au mois courant:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la dépense au mois courant"
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
    handleUpdateExpense,
    handleDeleteExpense,
    handleAddToCurrentMonth,
    getBudgetName,
    currentDate,
  };
};
