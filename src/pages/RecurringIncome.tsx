
import { useRecurringIncome } from "@/hooks/useRecurringIncome";
import { RecurringIncomeHeader } from "@/components/recurring/RecurringIncomeHeader";
import { RecurringIncomeEmptyState } from "@/components/recurring/RecurringIncomeEmptyState";
import { RecurringIncomeGrid } from "@/components/recurring/RecurringIncomeGrid";
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { EditIncomeDialog } from "@/components/income/EditIncomeDialog";

const RecurringIncome = () => {
  const {
    recurringIncomes,
    isLoading,
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    selectedIncome,
    setSelectedIncome,
    handleAddIncome,
    handleEditIncome,
    handleDeleteIncome,
    handleIncomeClick
  } = useRecurringIncome();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <RecurringIncomeHeader 
        onAdd={() => setAddDialogOpen(true)}
      />

      {isLoading ? (
        <div className="text-center py-8">Chargement des revenus récurrents...</div>
      ) : recurringIncomes.length === 0 ? (
        <RecurringIncomeEmptyState onAddClick={() => setAddDialogOpen(true)} />
      ) : (
        <RecurringIncomeGrid 
          incomes={recurringIncomes}
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

export default RecurringIncome;
