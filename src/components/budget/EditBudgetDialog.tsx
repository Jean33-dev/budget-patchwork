
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/shared/MoneyInput";
import { Button } from "@/components/ui/button";
import { Budget } from "@/hooks/useBudgets";
import { useTheme } from "@/context/ThemeContext";

interface EditBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onTitleChange: (title: string) => void;
  budget: number;
  onBudgetChange: (budget: number) => void;
  onSubmit: () => void;
}

export const EditBudgetDialog = ({
  open,
  onOpenChange,
  title,
  onTitleChange,
  budget,
  onBudgetChange,
  onSubmit,
}: EditBudgetDialogProps) => {
  const { t } = useTheme();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editBudgetDialog.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("editBudgetDialog.labelTitle")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder={t("editBudgetDialog.placeholderTitle")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">{t("editBudgetDialog.labelBudget")}</Label>
            <MoneyInput
              id="budget"
              value={budget}
              onChange={onBudgetChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit}>{t("editBudgetDialog.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
