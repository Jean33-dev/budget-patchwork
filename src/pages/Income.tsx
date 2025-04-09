
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { EditIncomeDialog } from "@/components/income/EditIncomeDialog";
import { IncomeHeader } from "@/components/income/IncomeHeader";
import { useIncomeManagement } from "@/hooks/useIncomeManagement";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { IncomeGrid } from "@/components/income/IncomeGrid";
import { IncomeEmptyState } from "@/components/income/IncomeEmptyState";

const Income = () => {
  const navigate = useNavigate();
  const {
    envelopes,
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    selectedIncome,
    setSelectedIncome,
    handleAddIncome,
    handleEditIncome,
    handleDeleteIncome,
    handleIncomeClick,
    isLoading
  } = useIncomeManagement();

  // Filtrer seulement les revenus non récurrents
  const nonRecurringIncomes = envelopes.filter(income => !income.isRecurring);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <IncomeHeader title="Gestion des Revenus" />
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/budget/recurring-income')}
          className="flex items-center gap-2"
        >
          <Clock className="h-4 w-4" />
          Revenus récurrents
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Chargement des revenus...</div>
      ) : nonRecurringIncomes.length === 0 ? (
        <IncomeEmptyState onAddClick={() => setAddDialogOpen(true)} />
      ) : (
        <IncomeGrid
          incomes={nonRecurringIncomes}
          onDelete={handleDeleteIncome}
          onIncomeClick={handleIncomeClick}
        />
      )}

      <AddEnvelopeDialog
        type="income"
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddIncome}
      />

      <EditIncomeDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        selectedIncome={selectedIncome}
        setSelectedIncome={setSelectedIncome}
        onEditIncome={handleEditIncome}
      />
    </div>
  );
};

export default Income;
