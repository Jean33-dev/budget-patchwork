
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
import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface DeleteExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean>;
  onSuccess?: () => void; // Nouvelle prop pour action après succès
}

export const DeleteExpenseDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onSuccess,
}: DeleteExpenseDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const confirmedRef = useRef(false);
  const safeToCloseRef = useRef(true);
  const confirmTimeoutRef = useRef<number | null>(null);
  
  // Reset state when dialog changes state
  useEffect(() => {
    if (!open) {
      console.log("Dialog fermé, réinitialisation de l'état de traitement");
      setIsProcessing(false);
      confirmedRef.current = false;
      
      // Clean up timeouts
      if (confirmTimeoutRef.current !== null) {
        window.clearTimeout(confirmTimeoutRef.current);
        confirmTimeoutRef.current = null;
      }
      
      // Reset safety state after closure
      setTimeout(() => {
        safeToCloseRef.current = true;
      }, 100);
    }
  }, [open]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (confirmTimeoutRef.current !== null) {
        window.clearTimeout(confirmTimeoutRef.current);
      }
    };
  }, []);

  const handleConfirm = async (e: React.MouseEvent) => {
    console.log("Confirmation cliquée");
    e.preventDefault();
    
    // Check if processing is already in progress
    if (isProcessing || confirmedRef.current) {
      console.log("Déjà en cours de traitement ou déjà confirmé, ignoré");
      return;
    }
    
    setIsProcessing(true);
    confirmedRef.current = true;
    safeToCloseRef.current = false;
    
    try {
      console.log("Exécution de la fonction onConfirm");
      const success = await onConfirm();
      console.log("Résultat onConfirm:", success);
      
      if (success) {
        console.log("Suppression réussie, fermeture de la boîte de dialogue");
        
        // Appeler onSuccess immédiatement si fourni
        if (onSuccess) {
          console.log("Exécution de l'action onSuccess");
          onSuccess();
        }
        
        // Defer dialog closure to allow UI to update
        confirmTimeoutRef.current = window.setTimeout(() => {
          if (open) { // Check that the box is still open
            console.log("Fermeture effective de la boîte de dialogue");
            onOpenChange(false);
          }
          confirmTimeoutRef.current = null;
        }, 300);
      } else {
        console.log("Échec de l'opération");
        setIsProcessing(false);
        confirmedRef.current = false;
        safeToCloseRef.current = true;
      }
    } catch (error) {
      console.error("Erreur lors de la confirmation:", error);
      setIsProcessing(false);
      confirmedRef.current = false;
      safeToCloseRef.current = true;
    }
  };

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={(newOpen) => {
        // Prevent closure during processing or when unsafe
        if (!safeToCloseRef.current && !newOpen) {
          console.log("Fermeture empêchée - pas sécuritaire");
          return;
        }
        if (isProcessing && !newOpen) {
          console.log("Fermeture empêchée pendant le traitement");
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
