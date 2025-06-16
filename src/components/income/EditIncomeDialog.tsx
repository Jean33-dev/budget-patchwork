
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EnvelopeForm } from "@/components/budget/EnvelopeForm";
import { Income } from "@/services/database";
import { useTheme } from "@/context/ThemeContext";

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
  const { t } = useTheme();

  // These functions update individual properties of selectedIncome
  const updateIncomeTitle = (title: string) => {
    if (selectedIncome) {
      setSelectedIncome({
        ...selectedIncome,
        title
      });
    }
  };

  const updateIncomeBudget = (budget: number) => {
    if (selectedIncome) {
      setSelectedIncome({
        ...selectedIncome,
        budget
      });
    }
  };

  const updateIncomeDate = (date: string) => {
    if (selectedIncome) {
      setSelectedIncome({
        ...selectedIncome,
        date
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("income.edit.title")}</DialogTitle>
        </DialogHeader>
        {selectedIncome && (
          <EnvelopeForm
            type="income"
            title={selectedIncome.title}
            setTitle={updateIncomeTitle}
            budget={selectedIncome.budget}
            setBudget={updateIncomeBudget}
            linkedBudgetId=""
            setLinkedBudgetId={() => {}}
            date={selectedIncome.date}
            setDate={updateIncomeDate}
            submitButtonText={t("income.save")}
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
