
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  }) => Promise<boolean> | boolean;
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
  
  console.log("AddEnvelopeDialog - availableBudgets:", availableBudgets);
  console.log("AddEnvelopeDialog - defaultBudgetId:", defaultBudgetId);
  console.log("AddEnvelopeDialog - linkedBudgetId:", linkedBudgetId);

  // Reset form when dialog opens or defaultBudgetId changes
  useEffect(() => {
    if (open) {
      setTitle("");
      setBudget(0);
      setLinkedBudgetId(defaultBudgetId || "");
      setDate(new Date().toISOString().split('T')[0]);
      console.log("Form reset with defaultBudgetId:", defaultBudgetId);
      console.log("Available budgets on form reset:", availableBudgets);
    }
  }, [open, defaultBudgetId, availableBudgets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await onAdd({ 
      title, 
      budget, 
      type,
      linkedBudgetId: type === "expense" ? linkedBudgetId : undefined,
      date
    });

    if (result === true) {
      onOpenChange(false);
    }
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
          <DialogDescription>
            {type === "expense" && availableBudgets.length === 0 
              ? "Aucun budget disponible. Veuillez créer un budget d'abord."
              : `Remplissez les détails pour ajouter un nouveau ${getTypeLabel(type)}.`
            }
          </DialogDescription>
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
