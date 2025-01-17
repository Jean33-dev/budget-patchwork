import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoneyInput } from "../shared/MoneyInput";

interface AddEnvelopeDialogProps {
  type: "income" | "expense";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (envelope: { title: string; budget: number; type: "income" | "expense" }) => void;
}

export const AddEnvelopeDialog = ({ type, open, onOpenChange, onAdd }: AddEnvelopeDialogProps) => {
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ title, budget, type });
    setTitle("");
    setBudget(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau {type === "income" ? "revenu" : "budget"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Entrez le titre du ${type === "income" ? "revenu" : "budget"}`}
              required
            />
          </div>
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
            <Button type="submit">Ajouter {type === "income" ? "le revenu" : "le budget"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};