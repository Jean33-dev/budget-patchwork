
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
  const [forceClose, setForceClose] = useState(false);

  // Réinitialiser l'état quand le dialogue s'ouvre
  useEffect(() => {
    if (open) {
      setIsProcessing(false);
      setForceClose(false);
    }
  }, [open]);

  // Forcer la fermeture du dialogue après un délai si forceClose est true
  useEffect(() => {
    if (forceClose) {
      const timer = setTimeout(() => {
        onOpenChange(false);
        setForceClose(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [forceClose, onOpenChange]);

  const handleConfirm = async () => {
    if (isProcessing) {
      console.log("[DEBUG] DeleteDialog - Déjà en cours de traitement, demande ignorée");
      return;
    }
    
    try {
      console.log("[DEBUG] DeleteDialog - Début de la confirmation");
      setIsProcessing(true);
      
      // Utiliser un délai pour éviter que l'interface ne bloque
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log("[DEBUG] DeleteDialog - Exécution de onConfirm");
      const result = await onConfirm();
      console.log("[DEBUG] DeleteDialog - Résultat onConfirm:", result);
      
      if (result) {
        console.log("[DEBUG] DeleteDialog - Fermeture de la boîte de dialogue");
        // Plutôt que de fermer directement, on indique qu'il faut fermer
        setForceClose(true);
      }
    } catch (error) {
      console.error("[DEBUG] DeleteDialog - Erreur pendant la confirmation:", error);
      setForceClose(true);
    }
  };

  return (
    <AlertDialog 
      open={open && !forceClose} 
      onOpenChange={(newOpen) => {
        console.log("[DEBUG] DeleteDialog - Changement d'état demandé:", newOpen, "isProcessing:", isProcessing);
        if (isProcessing && !newOpen) {
          console.log("[DEBUG] DeleteDialog - Tentative de fermeture pendant le traitement, ignorée");
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
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
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
