
import { useState, useEffect } from "react";
import { Category } from "@/types/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface EditCategoryDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (categoryId: string, newName: string) => Promise<boolean>;
}

export const EditCategoryDialog = ({
  category,
  open,
  onOpenChange,
  onSave,
}: EditCategoryDialogProps) => {
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    if (category) {
      setNewCategoryName(category.name);
    }
  }, [category]);

  const handleSave = async () => {
    if (category) {
      const success = await onSave(category.id, newCategoryName);
      if (success) {
        onOpenChange(false);
        setNewCategoryName("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Modifier la catégorie
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Nom de la catégorie</Label>
            <Input
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Entrez le nom de la catégorie"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Modifier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
