
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/services/database";

export type Expense = {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "expense";
  linkedBudgetId?: string;
  date: string;
};

export type Budget = {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "budget";
};

export const useExpenseManagement = (budgetId: string | null) => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Utiliser useCallback pour éviter des re-rendus inutiles
  const loadData = useCallback(async () => {
    try {
      const loadedBudgets = await db.getBudgets();
      console.log('Budgets chargés:', loadedBudgets);

      if (!loadedBudgets || loadedBudgets.length === 0) {
        // Créer des budgets par défaut si aucun n'existe
        const defaultBudgets: Budget[] = [
          {
            id: "budget1",
            title: "Budget Test 1",
            budget: 1000,
            spent: 0,
            type: "budget"
          },
          {
            id: "budget2",
            title: "Budget Test 2",
            budget: 2000,
            spent: 0,
            type: "budget"
          }
        ];

        for (const budget of defaultBudgets) {
          await db.addBudget(budget);
        }

        setAvailableBudgets(defaultBudgets);
      } else {
        setAvailableBudgets(loadedBudgets);
      }
      
      const loadedExpenses = await db.getExpenses();
      console.log('Dépenses chargées:', loadedExpenses);
      setExpenses(loadedExpenses);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données"
      });
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [budgetId, loadData]);

  const filteredExpenses = budgetId 
    ? expenses.filter(expense => expense.linkedBudgetId === budgetId)
    : expenses;

  const handleAddEnvelope = async (envelope: {
    title: string;
    budget: number;
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date?: string;
  }) => {
    if (envelope.type !== "expense") {
      toast({
        variant: "destructive",
        title: "Type invalide",
        description: "Seules les dépenses peuvent être ajoutées ici."
      });
      return;
    }

    try {
      const newExpense: Expense = {
        id: Date.now().toString(), // Utiliser timestamp pour garantir unicité
        title: envelope.title,
        budget: envelope.budget,
        spent: envelope.budget,
        type: "expense",
        linkedBudgetId: budgetId || envelope.linkedBudgetId,
        date: envelope.date || new Date().toISOString().split('T')[0]
      };

      await db.addExpense(newExpense);
      
      // Mettre à jour l'état local
      setExpenses(prev => [...prev, newExpense]);
      setAddDialogOpen(false);
      
      toast({
        title: "Dépense ajoutée",
        description: `La dépense "${envelope.title}" a été créée avec succès.`
      });
      
      // Recharger les données
      await loadData();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la dépense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la dépense"
      });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await db.deleteExpense(id);
      
      // Mise à jour de l'état local
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      
      toast({
        title: "Dépense supprimée",
        description: "La dépense a été supprimée avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
    }
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      // Supprimer l'ancienne dépense et ajouter la mise à jour
      // Comme nous n'avons pas de méthode de mise à jour, nous utilisons une combinaison de suppression et d'ajout
      await db.deleteExpense(updatedExpense.id);
      await db.addExpense(updatedExpense);
      
      // Mise à jour de l'état local
      setExpenses(prev => prev.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      ));
      
      toast({
        title: "Dépense modifiée",
        description: `La dépense "${updatedExpense.title}" a été modifiée avec succès.`
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la dépense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier la dépense"
      });
      
      // Recharger les données en cas d'erreur pour s'assurer que l'état local est synchronisé
      await loadData();
    }
  };

  return {
    expenses: filteredExpenses,
    availableBudgets,
    addDialogOpen,
    setAddDialogOpen,
    handleAddEnvelope,
    handleDeleteExpense,
    handleUpdateExpense,
    loadData,
  };
};
