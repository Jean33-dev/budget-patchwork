
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/services/database/models/budget";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { v4 as uuidv4 } from 'uuid';

export const useRecurringExpenses = () => {
  const { toast } = useToast();
  const [recurringExpenses, setRecurringExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentDate = format(new Date(), "yyyy-MM-dd");
  const { currentDashboardId } = useDashboardContext();

  const loadData = async () => {
    setIsLoading(true);
    try {
      await db.init();
      const expenses = await db.getRecurringExpenses();
      const budgets = await db.getBudgets();
      
      console.log("🔍 useRecurringExpenses - All recurring expenses:", expenses);
      console.log("🔍 useRecurringExpenses - Current dashboardId:", currentDashboardId);
      
      // Filtrer les dépenses récurrentes par dashboardId
      const filteredExpenses = expenses.filter(expense => {
        // Si le dashboard actuel est "budget", montrer les dépenses sans dashboardId
        // ou avec dashboardId "default" ou "budget"
        if (currentDashboardId === "budget") {
          const shouldInclude = !expense.dashboardId || 
                 expense.dashboardId === "default" || 
                 expense.dashboardId === "budget";
          console.log(`🔍 Recurring Expense ${expense.id} (${expense.title}) with dashboardId=${expense.dashboardId} on budget route: include=${shouldInclude}`);
          return shouldInclude;
        }
        
        // Pour les autres dashboards, ne montrer que les dépenses correspondantes
        // ou les dépenses sans dashboardId si on est sur le dashboard par défaut
        const shouldInclude = expense.dashboardId === currentDashboardId || 
               (!expense.dashboardId && currentDashboardId === "default");
        console.log(`🔍 Recurring Expense ${expense.id} (${expense.title}) with dashboardId=${expense.dashboardId} on dashboard ${currentDashboardId}: include=${shouldInclude}`);
        return shouldInclude;
      });
      
      console.log("🔍 useRecurringExpenses - Filtered recurring expenses:", filteredExpenses);
      setRecurringExpenses(filteredExpenses);
      setAvailableBudgets(budgets);
    } catch (error) {
      console.error("🔍 Erreur lors du chargement des dépenses récurrentes:", error);
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
    console.log("🔍 useRecurringExpenses - Effect triggered with dashboardId:", currentDashboardId);
    loadData();
  }, [currentDashboardId]);

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
      
      const dashboardToUse = currentDashboardId === "budget" ? "default" : currentDashboardId;
      console.log("useRecurringExpenses - Adding recurring expense with dashboardId:", dashboardToUse);
      
      const expense: Expense = {
        id: uuidv4(), // Utiliser UUID pour garantir l'unicité
        ...newExpense,
        type: "expense",
        spent: 0,
        isRecurring: true,
        dashboardId: dashboardToUse
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
      // Ensure the expense is still recurring
      const expense: Expense = {
        ...updatedExpense,
        type: "expense",
        isRecurring: true,
        // Conserver le dashboardId existant ou utiliser celui du contexte actuel
        dashboardId: updatedExpense.dashboardId || 
                    (currentDashboardId === "budget" ? "default" : currentDashboardId)
      };
      
      console.log("useRecurringExpenses - Updating expense with data:", expense);
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
      console.log(`Ajout de la dépense récurrente ${id} au mois courant (${currentDate})...`);
      await db.copyRecurringExpenseToMonth(id, currentDate);
      
      // Force reload to display the new monthly expense
      await loadData();
      
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
