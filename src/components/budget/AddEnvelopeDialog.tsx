
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EnvelopeForm } from "./EnvelopeForm";

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
  }) => void;
  availableBudgets?: Array<{ id: string; title: string }>;
  defaultBudgetId?: string;
}

export const AddEnvelopeDialog = ({ 
  type, 
  open, 
  onOpenChange, 
  onAdd,
  availableBudgets = [],
  defaultBudgetId
}: AddEnvelopeDialogProps) => {
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState(0);
  const [linkedBudgetId, setLinkedBudgetId] = useState(defaultBudgetId || "");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Reset form when dialog opens with defaultBudgetId
  useEffect(() => {
    if (open) {
      setTitle("");
      setBudget(0);
      setLinkedBudgetId(defaultBudgetId || "");
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [open, defaultBudgetId]);

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
      date
    });
  };

  const getTypeLabel = (type: "income" | "expense" | "budget") => {
    switch (type) {
      case "income":
        return "revenu";
      case "expense":
        return "dépense";
      case "budget":
        return "budget";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau {getTypeLabel(type)}</DialogTitle>
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
