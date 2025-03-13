
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MoneyInput } from "@/components/shared/MoneyInput";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface EditExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onTitleChange: (title: string) => void;
  budget: number;
  onBudgetChange: (budget: number) => void;
  date: string;
  onDateChange: (date: string) => void;
  onSubmit: () => Promise<boolean>;
  isSubmitting?: boolean;
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
  isSubmitting = false
}: EditExpenseDialogProps) => {
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    console.log("Tentative de soumission du formulaire d'édition");
    const success = await onSubmit();
    
    if (success) {
      console.log("Édition réussie, fermeture du dialogue");
      onOpenChange(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (isSubmitting && !newOpen) {
          console.log("Fermeture empêchée pendant la soumission");
          return;
        }
        onOpenChange(newOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la dépense</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la dépense</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <MoneyInput
              id="amount"
              value={budget}
              onChange={onBudgetChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
