
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
import { useTheme } from "@/context/ThemeContext";

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
  const { t } = useTheme();

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
            {t("categories.edit.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">{t("categories.edit.nameLabel")}</Label>
            <Input
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={t("categories.edit.namePlaceholder")}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("categories.edit.cancel")}
          </Button>
          <Button onClick={handleSave}>
            {t("categories.edit.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
