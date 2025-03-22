
import { useNavigate } from "react-router-dom";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BudgetsHeader } from "@/components/budget/BudgetsHeader";
import { EditBudgetDialog } from "@/components/budget/EditBudgetDialog";
import { DeleteBudgetDialog } from "@/components/budget/DeleteBudgetDialog";
import { useBudgets, Budget } from "@/hooks/useBudgets";
import { db } from "@/services/database";
import { Loader2 } from "lucide-react";

const Budgets = () => {
  const navigate = useNavigate();
  const { budgets, remainingAmount, addBudget, updateBudget, deleteBudget, isLoading, error } = useBudgets();
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBudget, setEditBudget] = useState(0);
  const [hasLinkedExpenses, setHasLinkedExpenses] = useState(false);

  const handleEnvelopeClick = (envelope: Budget) => {
    setSelectedBudget(envelope);
    setEditTitle(envelope.title);
    setEditBudget(envelope.budget);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedBudget) return;

    const success = await updateBudget({
      ...selectedBudget,
      title: editTitle,
      budget: editBudget
    });

    if (success) {
      setEditDialogOpen(false);
      setSelectedBudget(null);
    }
  };

  const handleViewExpenses = (envelope: Budget) => {
    navigate(`/dashboard/budget/expenses?budgetId=${envelope.id}`);
  };

  const handleAddEnvelope = async (envelope: { 
    title: string; 
    budget: number; 
    type: "income" | "expense" | "budget";
  }) => {
    if (envelope.type !== "budget") return;
    
    const budgetData = {
      title: envelope.title,
      budget: envelope.budget,
      type: "budget" as const
    };
    
    console.log("Ajout d'un nouveau budget:", budgetData);
    const success = await addBudget(budgetData);
    if (success) {
      setAddDialogOpen(false);
    }
  };

  const handleDeleteClick = async (envelope: Budget) => {
    setSelectedBudget(envelope);
    
    // Vérifier si le budget a des dépenses associées
    const expenses = await db.getExpenses();
    const linkedExpenses = expenses.filter(expense => expense.linkedBudgetId === envelope.id);
    setHasLinkedExpenses(linkedExpenses.length > 0);
    
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBudget) return;
    await deleteBudget(selectedBudget.id);
    setDeleteDialogOpen(false);
    setSelectedBudget(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Chargement des budgets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <BudgetsHeader onNavigate={navigate} />
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            Erreur lors du chargement des budgets. Veuillez rafraîchir la page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <BudgetsHeader onNavigate={navigate} />

      <div className="space-y-4">
        <div className={`text-sm font-medium ${remainingAmount < 0 ? 'text-red-500' : ''}`}>
          Montant restant à répartir : {Number.isFinite(remainingAmount) ? remainingAmount.toFixed(2) : "0.00"}€
        </div>
        {remainingAmount < 0 && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription>
              Le total des budgets dépasse vos revenus. Veuillez réduire certains budgets.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-8 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">Aucun budget trouvé. Créez votre premier budget en cliquant sur "Ajouter un budget".</p>
        </div>
      ) : (
        <EnvelopeList
          envelopes={budgets}
          type="budget"
          onAddClick={() => setAddDialogOpen(true)}
          onEnvelopeClick={handleEnvelopeClick}
          onViewExpenses={handleViewExpenses}
          onDeleteClick={handleDeleteClick}
        />
      )}

      <AddEnvelopeDialog
        type="budget"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddEnvelope}
      />

      <EditBudgetDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title={editTitle}
        onTitleChange={setEditTitle}
        budget={editBudget}
        onBudgetChange={setEditBudget}
        onSubmit={handleEditSubmit}
      />

      <DeleteBudgetDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        hasLinkedExpenses={hasLinkedExpenses}
      />
    </div>
  );
};

export default Budgets;
