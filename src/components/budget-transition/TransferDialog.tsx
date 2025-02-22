
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BudgetEnvelope } from "@/types/transition";

interface TransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEnvelope: BudgetEnvelope | null;
  envelopes: BudgetEnvelope[];
  onTransferTargetChange: (targetId: string) => void;
}

export const TransferDialog = ({
  open,
  onOpenChange,
  selectedEnvelope,
  envelopes,
  onTransferTargetChange,
}: TransferDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfert vers une autre enveloppe</DialogTitle>
          <DialogDescription>
            Choisissez l'enveloppe qui recevra les fonds
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select
            value={selectedEnvelope?.transferTargetId}
            onValueChange={onTransferTargetChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une enveloppe" />
            </SelectTrigger>
            <SelectContent>
              {envelopes
                .filter(env => env.id !== selectedEnvelope?.id)
                .map(env => (
                  <SelectItem key={env.id} value={env.id}>
                    {env.title}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
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
