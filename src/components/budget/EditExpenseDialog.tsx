
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
import { useState } from "react";
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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const success = await onSubmit();
      
      if (success) {
        // Close dialog with a small delay to avoid state conflict
        setTimeout(() => onOpenChange(false), 100);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        // Prevent closing dialog during processing
        if (isProcessing && !newOpen) return;
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
              disabled={isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <MoneyInput
              id="amount"
              value={budget}
              onChange={onBudgetChange}
              disabled={isProcessing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              disabled={isProcessing}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? (
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
