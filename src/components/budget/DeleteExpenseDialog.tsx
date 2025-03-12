
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
  
  // Réinitialiser isProcessing quand la boîte de dialogue change d'état
  useEffect(() => {
    if (!open) {
      console.log("Dialog fermé, réinitialisation de l'état de traitement");
      setIsProcessing(false);
    }
  }, [open]);

  const handleConfirm = async (e: React.MouseEvent) => {
    console.log("Confirmation cliquée");
    e.preventDefault();
    
    if (isProcessing) {
      console.log("Déjà en cours de traitement, ignoré");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      console.log("Exécution de la fonction onConfirm");
      const success = await onConfirm();
      console.log("Résultat onConfirm:", success);
      
      if (success) {
        console.log("Suppression réussie, fermeture de la boîte de dialogue");
        // Utiliser requestAnimationFrame pour s'assurer que le prochain cycle de rendu est prêt
        requestAnimationFrame(() => {
          setTimeout(() => {
            console.log("Fermeture effective de la boîte de dialogue");
            onOpenChange(false);
          }, 200);
        });
      } else {
        console.log("Échec de l'opération");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Erreur lors de la confirmation:", error);
      setIsProcessing(false);
    }
  };

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={(newOpen) => {
        console.log("Changement d'état de la boîte de dialogue:", newOpen);
        // Empêcher la fermeture pendant le traitement
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
