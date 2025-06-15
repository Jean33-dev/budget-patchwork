
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MoneyInput } from "@/components/shared/MoneyInput";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/context/ThemeContext";

interface EditExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onTitleChange: (title: string) => void;
  budget: number;
  onBudgetChange: (budget: number) => void;
  date: string;
  onDateChange: (date: string) => void;
  onSubmit: () => void;
}

export const EditExpenseDialog = ({
  open,
  onOpenChange,
  title,
  onTitleChange,
  budget,
  onBudgetChange,
  date,
  onDateChange,
  onSubmit,
}: EditExpenseDialogProps) => {
  const { t } = useTheme();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editExpenseDialog.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("editExpenseDialog.labelTitle")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">{t("editExpenseDialog.labelAmount")}</Label>
            <MoneyInput
              id="amount"
              value={budget}
              onChange={onBudgetChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">{t("editExpenseDialog.labelDate")}</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit}>{t("editExpenseDialog.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
