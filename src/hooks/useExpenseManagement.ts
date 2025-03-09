
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
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBudget, setEditBudget] = useState(0);
  const [editDate, setEditDate] = useState("");
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const loadedBudgets = await db.getBudgets();
      console.log('Budgets chargés:', loadedBudgets);

      if (!loadedBudgets || loadedBudgets.length === 0) {
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

  const handleEnvelopeClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setEditTitle(expense.title);
    setEditBudget(expense.budget);
    setEditDate(expense.date);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedExpense) return;

    try {
      const updatedExpense: Expense = {
        ...selectedExpense,
        title: editTitle,
        budget: editBudget,
        spent: editBudget,
        date: editDate
      };

      await db.updateExpense(updatedExpense);

      setExpenses(prev => prev.map(expense => 
        expense.id === selectedExpense.id ? updatedExpense : expense
      ));
      
      setEditDialogOpen(false);
      
      toast({
        title: "Dépense modifiée",
        description: `La dépense "${editTitle}" a été mise à jour.`
      });

      await loadData();
    } catch (error) {
      console.error("Erreur lors de la modification de la dépense:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier la dépense"
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedExpense || isDeleting) return;

    try {
      setIsDeleting(true);
      
      console.log("Suppression de la dépense avec ID:", selectedExpense.id);
      const deleteSuccess = await db.deleteExpense(selectedExpense.id);

      if (deleteSuccess) {
        setExpenses(prev => prev.filter(expense => expense.id !== selectedExpense.id));
        
        toast({
          title: "Dépense supprimée",
          description: `La dépense "${selectedExpense.title}" a été supprimée.`
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "La dépense n'a pas pu être supprimée. Elle n'existe peut-être plus."
        });
      }

      setSelectedExpense(null);
      setDeleteDialogOpen(false);
      setIsDeleting(false);
      
      setTimeout(() => {
        loadData();
      }, 300);
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense:", error);
      setIsDeleting(false);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la dépense"
      });
    }
  };

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
        id: Date.now().toString(),
        title: envelope.title,
        budget: envelope.budget,
        spent: envelope.budget,
        type: "expense",
        linkedBudgetId: budgetId || envelope.linkedBudgetId,
        date: envelope.date || new Date().toISOString().split('T')[0]
      };

      await db.addExpense(newExpense);
      
      setExpenses(prev => [...prev, newExpense]);
      setAddDialogOpen(false);
      
      toast({
        title: "Dépense ajoutée",
        description: `La dépense "${envelope.title}" a été créée avec succès.`
      });
      
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

  return {
    expenses: filteredExpenses,
    availableBudgets,
    selectedExpense,
    editTitle,
    setEditTitle,
    editBudget,
    setEditBudget,
    editDate,
    setEditDate,
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleEnvelopeClick,
    handleDeleteClick,
    handleEditSubmit,
    handleDeleteConfirm,
    handleAddEnvelope,
    loadData,
  };
};
