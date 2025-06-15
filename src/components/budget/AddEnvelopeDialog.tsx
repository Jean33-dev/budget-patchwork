
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EnvelopeForm } from "./EnvelopeForm";
import { useTheme } from "@/context/ThemeContext";

interface AddEnvelopeDialogProps {
  type: "income" | "expense" | "budget";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (envelope: { 
    title: string; 
    budget: number; 
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
    date: string;
    isRecurring?: boolean;
  }) => void;
  availableBudgets?: Array<{ id: string; title: string }>;
  defaultBudgetId?: string;
  isRecurring?: boolean;
  dialogTitle?: string;
  defaultValues?: {
    title: string;
    budget: number;
    linkedBudgetId?: string;
    date: string;
  };
}

export const AddEnvelopeDialog = ({ 
  type, 
  open, 
  onOpenChange, 
  onAdd,
  availableBudgets = [],
  defaultBudgetId,
  isRecurring = false,
  dialogTitle,
  defaultValues
}: AddEnvelopeDialogProps) => {
  const [title, setTitle] = useState(defaultValues?.title || "");
  const [budget, setBudget] = useState(defaultValues?.budget || 0);
  const [linkedBudgetId, setLinkedBudgetId] = useState(defaultValues?.linkedBudgetId || defaultBudgetId || "");
  const [date, setDate] = useState(defaultValues?.date || new Date().toISOString().split('T')[0]);

  // Update form when defaultValues changes
  useEffect(() => {
    if (defaultValues) {
      setTitle(defaultValues.title || "");
      setBudget(defaultValues.budget || 0);
      setLinkedBudgetId(defaultValues.linkedBudgetId || defaultBudgetId || "");
      setDate(defaultValues.date || new Date().toISOString().split('T')[0]);
    } else {
      setTitle("");
      setBudget(0);
      setLinkedBudgetId(defaultBudgetId || "");
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [defaultValues, defaultBudgetId, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type === "expense" && !linkedBudgetId) {
      alert("Veuillez sélectionner un budget pour cette dépense");
      return;
    }

    onAdd({ 
      title, 
      budget, 
      type,
      linkedBudgetId: type === "expense" ? linkedBudgetId : undefined,
      date,
      isRecurring
    });
    
    // Reset form fields after submission
    setTitle("");
    setBudget(0);
    setLinkedBudgetId(defaultBudgetId || "");
    setDate(new Date().toISOString().split('T')[0]);
    onOpenChange(false);
  };

  const { t } = useTheme();

  const getTypeLabel = (type: "income" | "expense" | "budget") => {
    switch (type) {
      case "income":
        return t("envelopeForm.type.income");
      case "expense":
        return t("envelopeForm.type.expense");
      case "budget":
        return t("envelopeForm.type.budget");
      default:
        return "";
    }
  };

  const getDialogTitle = () => {
    if (dialogTitle) return dialogTitle;
    return t("envelopeForm.dialogTitle")
      .replace("{type}", getTypeLabel(type))
      .replace("{isRecurring}", isRecurring ? t("envelopeForm.recurringSuffix") : "");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {getDialogTitle()}
          </DialogTitle>
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
        />
      </DialogContent>
    </Dialog>
  );
};
