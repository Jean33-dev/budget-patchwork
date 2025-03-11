
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
import { useState, useCallback } from "react";
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

  const handleConfirm = useCallback(async () => {
    if (isProcessing) {
      console.log("[DEBUG] DeleteDialog - Tentative de confirmation pendant le traitement, ignorée");
      return;
    }
    
    console.log("[DEBUG] DeleteDialog - Début de la confirmation");
    setIsProcessing(true);
    
    try {
      console.log("[DEBUG] DeleteDialog - Exécution de onConfirm");
      const result = await onConfirm();
      console.log("[DEBUG] DeleteDialog - Résultat onConfirm:", result);
      
      if (result) {
        console.log("[DEBUG] DeleteDialog - Fermeture de la boîte de dialogue");
        onOpenChange(false);
      }
    } catch (error) {
      console.error("[DEBUG] DeleteDialog - Erreur pendant la confirmation:", error);
    } finally {
      console.log("[DEBUG] DeleteDialog - Réinitialisation de l'état de traitement");
      // Petit délai avant de réinitialiser l'état
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    }
  }, [isProcessing, onConfirm, onOpenChange]);

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={(newOpen) => {
        console.log("[DEBUG] DeleteDialog - Changement d'état ouvert:", newOpen, "isProcessing:", isProcessing);
        if (isProcessing) {
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
