
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
import { useState } from "react";

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

  const handleConfirm = async () => {
    if (isProcessing) return;
    
    try {
      // Marquer comme en cours de traitement
      setIsProcessing(true);
      
      // Fermer la boîte de dialogue
      onOpenChange(false);
      
      // On laisse la boîte de dialogue se fermer complètement avant de continuer
      // en utilisant un délai plus long
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Exécuter l'action de confirmation (la suppression)
      await onConfirm();
    } catch (error) {
      console.error("Erreur lors de la confirmation de suppression:", error);
    } finally {
      // Réinitialiser l'état de traitement
      setIsProcessing(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(newOpen) => {
      // Si on est en train de traiter, ne pas permettre la fermeture manuelle
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
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
