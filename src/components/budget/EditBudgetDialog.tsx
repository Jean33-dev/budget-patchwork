
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/shared/MoneyInput";
import { Button } from "@/components/ui/button";

interface EditBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onTitleChange: (title: string) => void;
  budget: number;
  onBudgetChange: (budget: number) => void;
  onSubmit: () => void;
  onDelete: () => void;
}

export const EditBudgetDialog = ({
  open,
  onOpenChange,
  title,
  onTitleChange,
  budget,
  onBudgetChange,
  onSubmit,
  onDelete,
}: EditBudgetDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le budget</DialogTitle>
          <DialogDescription>
            Modifiez les informations du budget ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du budget</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Entrez le titre du budget"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Montant du budget</Label>
            <MoneyInput
              id="budget"
              value={budget}
              onChange={onBudgetChange}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="destructive" onClick={onDelete}>
            Supprimer
          </Button>
          <Button onClick={onSubmit}>Enregistrer les modifications</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
