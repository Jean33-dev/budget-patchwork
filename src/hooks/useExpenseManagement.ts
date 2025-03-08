
import { useState, useEffect } from "react";
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

  useEffect(() => {
    loadData();
  }, [budgetId]);

  const loadData = async () => {
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
  };

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

      const updatedExpenses = expenses.map(expense => 
        expense.id === selectedExpense.id ? updatedExpense : expense
      );

      setExpenses(updatedExpenses);
      setEditDialogOpen(false);
      
      toast({
        title: "Dépense modifiée",
        description: `La dépense "${editTitle}" a été mise à jour.`
      });
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
    if (!selectedExpense) return;

    try {
      await db.deleteExpense(selectedExpense.id);

      // Mettre à jour l'état local immédiatement
      const updatedExpenses = expenses.filter(
        expense => expense.id !== selectedExpense.id
      );

      setExpenses(updatedExpenses);
      setDeleteDialogOpen(false);
      setSelectedExpense(null); // Réinitialiser la dépense sélectionnée
      
      toast({
        title: "Dépense supprimée",
        description: `La dépense "${selectedExpense.title}" a été supprimée.`
      });

      // Recharger les données pour s'assurer que tout est synchronisé
      await loadData();
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense:", error);
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
        id: Date.now().toString(), // Utiliser timestamp pour garantir unicité
        title: envelope.title,
        budget: envelope.budget,
        spent: envelope.budget,
        type: "expense",
        linkedBudgetId: budgetId || envelope.linkedBudgetId,
        date: envelope.date || new Date().toISOString().split('T')[0]
      };

      await db.addExpense(newExpense);
      setExpenses([...expenses, newExpense]);
      setAddDialogOpen(false);
      
      toast({
        title: "Dépense ajoutée",
        description: `La dépense "${envelope.title}" a été créée avec succès.`
      });
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
    loadData, // Exposer cette fonction pour permettre le rechargement
  };
};
