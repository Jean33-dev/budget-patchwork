
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
  envelope: BudgetEnvelope; // Changed from selectedEnvelope
  targetEnvelopes: BudgetEnvelope[]; // Changed from envelopes
  onTargetChange: (targetId: string) => void;
}

export const TransferDialog = ({
  open,
  onOpenChange,
  envelope, // Updated parameter name
  targetEnvelopes, // Updated parameter name
  onTargetChange,
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
            value={envelope?.transferTargetId}
            onValueChange={onTargetChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une enveloppe" />
            </SelectTrigger>
            <SelectContent>
              {targetEnvelopes
                .filter(env => env.id !== envelope?.id)
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
