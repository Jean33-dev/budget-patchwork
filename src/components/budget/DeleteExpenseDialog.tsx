
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

  const handleConfirm = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    console.log("[DEBUG] DeleteDialog - Début de la confirmation");
    console.log("[DEBUG] DeleteDialog - Exécution de onConfirm");
    
    try {
      const result = await onConfirm();
      console.log("[DEBUG] DeleteDialog - Résultat onConfirm:", result);
      
      if (result) {
        console.log("[DEBUG] DeleteDialog - Fermeture de la boîte de dialogue");
        onOpenChange(false);
      }
    } catch (error) {
      console.error("[ERREUR] Erreur lors de la suppression:", error);
    } finally {
      // Désactiver l'état de traitement après un court délai
      setTimeout(() => {
        setIsProcessing(false);
      }, 300);
    }
  };

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (isProcessing && !newOpen) {
          return; // Empêcher la fermeture pendant le traitement
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
              e.preventDefault(); // Empêcher le comportement par défaut du bouton
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
