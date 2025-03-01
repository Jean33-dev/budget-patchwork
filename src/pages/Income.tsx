
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { EditIncomeDialog } from "@/components/income/EditIncomeDialog";
import { IncomeHeader } from "@/components/income/IncomeHeader";
import { useIncomeManagement } from "@/hooks/useIncomeManagement";

const Income = () => {
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
    handleIncomeClick
  } = useIncomeManagement();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <IncomeHeader title="Gestion des Revenus" />

      <EnvelopeList
        envelopes={envelopes}
        type="income"
        onAddClick={() => setAddDialogOpen(true)}
        onEnvelopeClick={handleIncomeClick}
        onDeleteEnvelope={handleDeleteIncome}
      />

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
