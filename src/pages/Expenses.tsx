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
    setSelectedExpense(expense);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = () => {
    if (!selectedExpense) return;

    const updatedExpenses = expenses.map(expense => {
      if (expense.id === selectedExpense.id) {
        return {
          ...expense,
          title: editTitle,
          budget: editBudget,
          spent: editBudget,
          date: editDate
        };
      }
      return expense;
    });

    setExpenses(updatedExpenses);
    setEditDialogOpen(false);
    toast({
      title: "Dépense modifiée",
      description: `La dépense "${editTitle}" a été mise à jour.`
    });
  };

  const handleDeleteConfirm = () => {
    if (!selectedExpense) return;

    const updatedExpenses = expenses.filter(
      expense => expense.id !== selectedExpense.id
    );

    setExpenses(updatedExpenses);
    setDeleteDialogOpen(false);
    toast({
      title: "Dépense supprimée",
      description: `La dépense "${selectedExpense.title}" a été supprimée.`
    });
  };

  const handleAddEnvelope = (envelope: {
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

    const newExpense: Expense = {
      id: (expenses.length + 1).toString(),
      title: envelope.title,
      budget: envelope.budget,
      spent: envelope.budget,
      type: "expense",
      linkedBudgetId: budgetId || envelope.linkedBudgetId,
      date: envelope.date || new Date().toISOString().split('T')[0]
    };

    setExpenses([...expenses, newExpense]);
    setAddDialogOpen(false);
    toast({
      title: "Dépense ajoutée",
      description: `La dépense "${envelope.title}" a été créée avec succès.`
    });
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
