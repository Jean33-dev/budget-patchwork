
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoneyInput } from "../shared/MoneyInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useEffect } from "react";

interface EnvelopeFormProps {
  type: "income" | "expense" | "budget";
  title: string;
  setTitle: (title: string) => void;
  budget: number;
  setBudget: (budget: number) => void;
  linkedBudgetId: string;
  setLinkedBudgetId: (id: string) => void;
  date: string;
  setDate: (date: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  availableBudgets?: Array<{ id: string; title: string }>;
}

export const EnvelopeForm = ({
  type,
  title,
  setTitle,
  budget,
  setBudget,
  linkedBudgetId,
  setLinkedBudgetId,
  date,
  setDate,
  onSubmit,
  availableBudgets = []
}: EnvelopeFormProps) => {
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

  // Debugging
  useEffect(() => {
    console.log(`EnvelopeForm - Type: ${type}, Budget actuel: ${budget}`);
  }, [type, budget]);

  const handleBudgetChange = (newValue: number) => {
    console.log(`EnvelopeForm - Montant saisi: ${newValue}`);
    setBudget(newValue);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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

      {(type === "expense" || type === "income") && (
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      )}

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
          onChange={handleBudgetChange}
          required
        />
      </div>
      <DialogFooter>
        <Button type="submit">Ajouter {getTypeLabel(type)}</Button>
      </DialogFooter>
    </form>
  );
};
