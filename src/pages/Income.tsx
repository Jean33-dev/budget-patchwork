
import { AddEnvelopeDialog } from "@/components/budget/AddEnvelopeDialog";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { EditIncomeDialog } from "@/components/income/EditIncomeDialog";
import { IncomeHeader } from "@/components/income/IncomeHeader";
import { useIncomeManagement } from "@/hooks/useIncomeManagement";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

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
    handleIncomeClick
  } = useIncomeManagement();

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
