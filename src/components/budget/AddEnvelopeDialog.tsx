
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EnvelopeForm } from "./EnvelopeForm";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

interface AddEnvelopeDialogProps {
  type: "income" | "expense" | "budget";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: { 
    title: string; 
    budget: number; 
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date: string;
    isRecurring?: boolean;
  }) => void;
  availableBudgets?: Array<{ id: string; title: string }>;
  isRecurring?: boolean;
  defaultValues?: {
    title: string;
    budget: number;
    linkedBudgetId?: string;
    date: string;
  };
  dialogTitle?: string;
  submitButtonText?: string;
}

export const AddEnvelopeDialog = ({ 
  type, 
  open, 
  onOpenChange, 
  onAdd,
  availableBudgets = [],
  isRecurring = false,
  defaultValues,
  dialogTitle,
  submitButtonText
}: AddEnvelopeDialogProps) => {
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState(0);
  const [linkedBudgetId, setLinkedBudgetId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { t } = useTheme();

  // Reset form when dialog opens/closes or when switching between add/edit modes
  useEffect(() => {
    if (open && defaultValues) {
      // Editing mode
      setTitle(defaultValues.title);
      setBudget(defaultValues.budget);
      setLinkedBudgetId(defaultValues.linkedBudgetId || "");
      setDate(defaultValues.date);
    } else if (open && !defaultValues) {
      // Adding mode
      setTitle("");
      setBudget(0);
      setLinkedBudgetId("");
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [open, defaultValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      title,
      budget,
      type,
      linkedBudgetId: type === "expense" ? linkedBudgetId : undefined,
      date,
      isRecurring
    };
    
    onAdd(data);
    onOpenChange(false);
  };

  const getDefaultDialogTitle = () => {
    if (isRecurring) {
      return type === "expense" ? t("expenses.addRecurringExpense") : t("income.addRecurring");
    }
    return type === "expense" ? t("expenses.addExpense") : 
           type === "income" ? t("income.addOneTime") : 
           t("budgets.addBudget");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle || getDefaultDialogTitle()}</DialogTitle>
        </DialogHeader>
        <EnvelopeForm
          type={type}
          title={title}
          setTitle={setTitle}
          budget={budget}
          setBudget={setBudget}
          linkedBudgetId={linkedBudgetId}
          setLinkedBudgetId={setLinkedBudgetId}
          date={date}
          setDate={setDate}
          onSubmit={handleSubmit}
          availableBudgets={availableBudgets}
          submitButtonText={submitButtonText}
        />
      </DialogContent>
    </Dialog>
  );
};
