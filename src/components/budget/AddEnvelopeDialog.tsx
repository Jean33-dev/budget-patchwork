import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoneyInput } from "../shared/MoneyInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddEnvelopeDialogProps {
  type: "income" | "expense" | "budget";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (envelope: { 
    title: string; 
    budget: number; 
    type: "income" | "expense" | "budget";
    linkedBudgetId?: string;
  }) => void;
  availableBudgets?: Array<{ id: string; title: string }>;
}

export const AddEnvelopeDialog = ({ 
  type, 
  open, 
  onOpenChange, 
  onAdd,
  availableBudgets = []
}: AddEnvelopeDialogProps) => {
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState(0);
  const [linkedBudgetId, setLinkedBudgetId] = useState("");

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
      linkedBudgetId: type === "expense" ? linkedBudgetId : undefined
    });
    
    setTitle("");
    setBudget(0);
    setLinkedBudgetId("");
    onOpenChange(false);
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Entrez le titre du ${getTypeLabel(type)}`}
              required
            />
          </div>

          {type === "expense" && (
            <div className="space-y-2">
              <Label>Budget associé</Label>
              <Select value={linkedBudgetId} onValueChange={setLinkedBudgetId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un budget" />
                </SelectTrigger>
                <SelectContent>
                  {availableBudgets.map((budget) => (
                    <SelectItem key={budget.id} value={budget.id}>
                      {budget.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableBudgets.length === 0 && (
                <p className="text-sm text-red-500">
                  Aucun budget disponible. Veuillez d'abord créer un budget.
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="budget">Montant</Label>
            <MoneyInput
              id="budget"
              value={budget}
              onChange={setBudget}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Ajouter {getTypeLabel(type)}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};