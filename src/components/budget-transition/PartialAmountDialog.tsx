
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoneyInput } from "@/components/shared/MoneyInput";
import { BudgetEnvelope } from "@/types/transition";

interface PartialAmountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEnvelope: BudgetEnvelope | null;
  onAmountChange: (amount: number) => void;
}

export const PartialAmountDialog = ({
  open,
  onOpenChange,
  selectedEnvelope,
  onAmountChange,
}: PartialAmountDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report partiel</DialogTitle>
          <DialogDescription>
            Choisissez le montant à reporter sur le mois suivant
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <MoneyInput
            value={selectedEnvelope?.partialAmount || 0}
            onChange={onAmountChange}
            placeholder="Montant à reporter"
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
