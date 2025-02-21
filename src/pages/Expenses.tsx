
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { ExpensesHeader } from "@/components/budget/ExpensesHeader";
import { EditExpenseDialog } from "@/components/budget/EditExpenseDialog";
import { DeleteExpenseDialog } from "@/components/budget/DeleteExpenseDialog";
import { db } from "@/services/database";

type Expense = {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "expense";
  linkedBudgetId?: string;
  date: string;
};

type Budget = {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "budget";
};

const Expenses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const budgetId = searchParams.get('budgetId');
  const { toast } = useToast();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [availableBudgets, setAvailableBudgets] = useState<Budget[]>([]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBudget, setEditBudget] = useState(0);
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const budgets = await db.getBudgets();
        console.log('Budgets chargés:', budgets);
        setAvailableBudgets(budgets);
        
        const expenses = await db.getExpenses();
        console.log('Dépenses chargées:', expenses);
        setExpenses(expenses);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données"
        });
      }
    };
    
    loadData();
  }, []);

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
    // Vérifie si l'enveloppe a des dépenses affectées
    const hasLinkedExpenses = expenses.some(e => e.linkedBudgetId === expense.id);
    
    if (hasLinkedExpenses) {
      toast({
        variant: "destructive",
        title: "Suppression impossible",
        description: "Cette dépense a des dépenses qui lui sont affectées."
      });
      return;
    }

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

      const updatedExpenses = expenses.map(expense => {
        if (expense.id === selectedExpense.id) {
          return updatedExpense;
        }
        return expense;
      });

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

      const updatedExpenses = expenses.filter(
        expense => expense.id !== selectedExpense.id
      );

      setExpenses(updatedExpenses);
      setDeleteDialogOpen(false);
      
      toast({
        title: "Dépense supprimée",
        description: `La dépense "${selectedExpense.title}" a été supprimée.`
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

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <ExpensesHeader onNavigate={navigate} />

      <div className="mt-6">
        <EnvelopeList
          envelopes={filteredExpenses}
          type="expense"
          onAddClick={() => setAddDialogOpen(true)}
          onEnvelopeClick={handleEnvelopeClick}
          onDeleteClick={handleDeleteClick}
          availableBudgets={availableBudgets}
        />
      </div>

      <AddEnvelopeDialog
        type="expense"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddEnvelope}
        defaultBudgetId={budgetId || undefined}
        availableBudgets={availableBudgets}
      />

      <EditExpenseDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title={editTitle}
        onTitleChange={setEditTitle}
        budget={editBudget}
        onBudgetChange={setEditBudget}
        date={editDate}
        onDateChange={setEditDate}
        onSubmit={handleEditSubmit}
      />

      <DeleteExpenseDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Expenses;
