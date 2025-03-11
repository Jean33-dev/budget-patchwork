
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

  // Gérer la confirmation en fermant d'abord la boîte de dialogue
  const handleConfirm = async () => {
    if (isProcessing) return;
    
    try {
      // Indiquer que le traitement est en cours
      setIsProcessing(true);
      
      // Fermer la boîte de dialogue immédiatement
      onOpenChange(false);
      
      // Délai plus long pour s'assurer que la boîte de dialogue est complètement fermée
      setTimeout(async () => {
        try {
          // Exécuter la suppression après la fermeture de la boîte de dialogue
          await onConfirm();
        } catch (error) {
          console.error("Erreur lors de la confirmation de suppression:", error);
        } finally {
          // Réinitialiser l'état de traitement
          setIsProcessing(false);
        }
      }, 300);
    } catch (error) {
      console.error("Erreur lors de la gestion de la confirmation:", error);
      setIsProcessing(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
