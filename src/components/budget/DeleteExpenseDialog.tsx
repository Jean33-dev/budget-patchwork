
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface DeleteExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean>;
  onSuccess?: () => void;
}

export const DeleteExpenseDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onSuccess,
}: DeleteExpenseDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Reset processing state when dialog closes
  useEffect(() => {
    if (!open) {
      setIsProcessing(false);
    }
  }, [open]);
  
  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const success = await onConfirm();
      
      if (success) {
        // Notify parent component about successful deletion
        if (onSuccess) onSuccess();
        // Close dialog with a small delay to avoid state conflict
        setTimeout(() => onOpenChange(false), 100);
      }
    } finally {
      // Always reset processing state, even if there was an error
      setIsProcessing(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(newOpen) => {
      // Prevent closing dialog during processing
      if (isProcessing && !newOpen) return;
      onOpenChange(newOpen);
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la dépense</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action ne peut pas être annulée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={isProcessing}
            type="button"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
