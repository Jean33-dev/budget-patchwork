
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
import { useToast } from "@/hooks/use-toast";

const Budgets = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { budgets, remainingAmount, addBudget, updateBudget, deleteBudget } = useBudgets();
  
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
    
    const success = await addBudget(budgetData);
    if (success) {
      setAddDialogOpen(false);
    }
  };

  const handleDeleteClick = async (envelope: Budget) => {
    try {
      console.log("Début de handleDeleteClick avec envelope:", envelope);
      setSelectedBudget(envelope);
      
      const expenses = await db.getExpenses();
      console.log("Dépenses récupérées:", expenses);
      
      const linkedExpenses = expenses.filter(expense => expense.linkedBudgetId === envelope.id);
      console.log("Dépenses liées:", linkedExpenses);
      
      setHasLinkedExpenses(linkedExpenses.length > 0);
      setDeleteDialogOpen(true);
    } catch (error) {
      console.error("Erreur dans handleDeleteClick:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification des dépenses"
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log("Début de handleDeleteConfirm, selectedBudget:", selectedBudget);
      
      if (!selectedBudget) {
        console.error("Aucun budget sélectionné");
        return;
      }

      const success = await deleteBudget(selectedBudget.id);
      console.log("Résultat de la suppression:", success);
      
      if (success) {
        setDeleteDialogOpen(false);
        setEditDialogOpen(false);
        setSelectedBudget(null);
        toast({
          title: "Succès",
          description: "Le budget a été supprimé avec succès"
        });
      }
    } catch (error) {
      console.error("Erreur dans handleDeleteConfirm:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression"
      });
    }
  };

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

      <EnvelopeList
        envelopes={budgets}
        type="budget"
        onAddClick={() => setAddDialogOpen(true)}
        onEnvelopeClick={handleEnvelopeClick}
        onViewExpenses={handleViewExpenses}
        onDeleteClick={handleDeleteClick}
      />

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
        onDelete={() => handleDeleteClick(selectedBudget!)}
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
