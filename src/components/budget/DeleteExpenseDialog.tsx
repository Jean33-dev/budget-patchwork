
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
}

export const DeleteExpenseDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: DeleteExpenseDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Réinitialiser isProcessing quand la boîte de dialogue se ferme
  useEffect(() => {
    if (!open) {
      console.log("Dialog closed, resetting processing state");
      setIsProcessing(false);
    }
  }, [open]);

  const handleConfirm = async (e: React.MouseEvent) => {
    console.log("Confirmation clicked");
    e.preventDefault();
    
    if (isProcessing) {
      console.log("Déjà en cours de traitement");
      return;
    }
    
    console.log("Setting processing state");
    setIsProcessing(true);
    
    try {
      console.log("Executing onConfirm function");
      const success = await onConfirm();
      console.log("Confirm result:", success);
      
      if (success) {
        console.log("Success, closing dialog");
        onOpenChange(false);
      } else {
        console.log("Operation failed but without error");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Dialog confirm error:", error);
      setIsProcessing(false);
    }
  };

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={(newOpen) => {
        console.log("Dialog state changing to:", newOpen);
        if (isProcessing && !newOpen) {
          console.log("Prevented dialog close during processing");
          return;
        }
        onOpenChange(newOpen);
      }}
    >
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
