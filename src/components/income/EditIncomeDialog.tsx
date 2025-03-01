
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EnvelopeForm } from "@/components/budget/EnvelopeForm";
import { Income } from "@/services/database";

interface EditIncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIncome: {
    id: string;
    title: string;
    budget: number;
    type: "income";
    date: string;
  } | null;
  setSelectedIncome: (income: {
    id: string;
    title: string;
    budget: number;
    type: "income";
    date: string;
  } | null) => void;
  onEditIncome: (editedIncome: { 
    title: string; 
    budget: number; 
    type: "income"; 
    date: string 
  }) => void;
}

export const EditIncomeDialog = ({
  open,
  onOpenChange,
  selectedIncome,
  setSelectedIncome,
  onEditIncome
}: EditIncomeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le revenu</DialogTitle>
        </DialogHeader>
        {selectedIncome && (
          <EnvelopeForm
            type="income"
            title={selectedIncome.title}
            setTitle={(title) => setSelectedIncome(prev => prev ? { ...prev, title } : null)}
            budget={selectedIncome.budget}
            setBudget={(budget) => setSelectedIncome(prev => prev ? { ...prev, budget } : null)}
            linkedBudgetId=""
            setLinkedBudgetId={() => {}}
            date={selectedIncome.date}
            setDate={(date) => setSelectedIncome(prev => prev ? { ...prev, date } : null)}
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedIncome) {
                onEditIncome(selectedIncome);
              }
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
