import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoneyInput } from "../shared/MoneyInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExpenseCategories } from "./ExpenseCategories";

interface AddEnvelopeDialogProps {
  type: "income" | "expense" | "budget";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (envelope: { title: string; budget: number; type: "income" | "expense" | "budget"; category?: string }) => void;
}

export const AddEnvelopeDialog = ({ type, open, onOpenChange, onAdd }: AddEnvelopeDialogProps) => {
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState(0);
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const { categories, addCategory } = useExpenseCategories();
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ title, budget, type, category: type === "expense" || type === "budget" ? category : undefined });
    setTitle("");
    setBudget(0);
    setCategory("");
    onOpenChange(false);
  };

  const handleAddNewCategory = () => {
    if (newCategory) {
      addCategory(newCategory);
      setCategory(newCategory);
      setNewCategory("");
      setShowNewCategoryInput(false);
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
          
          {(type === "expense" || type === "budget") && (
            <div className="space-y-2">
              <Label>Catégorie</Label>
              {!showNewCategoryInput ? (
                <div className="flex gap-2">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewCategoryInput(true)}
                  >
                    Nouvelle
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nom de la nouvelle catégorie"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddNewCategory}
                  >
                    Ajouter
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowNewCategoryInput(false);
                      setNewCategory("");
                    }}
                  >
                    Annuler
                  </Button>
                </div>
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