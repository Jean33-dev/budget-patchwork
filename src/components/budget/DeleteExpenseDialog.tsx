
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

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      console.log("[DEBUG] DeleteDialog - Exécution de onConfirm");
      
      // Appel de la fonction de confirmation et attente du résultat
      const result = await onConfirm();
      console.log("[DEBUG] DeleteDialog - Résultat onConfirm:", result);
      
      if (result) {
        console.log("[DEBUG] DeleteDialog - Fermeture de la boîte de dialogue");
        // Fermer la boîte de dialogue APRÈS que onConfirm ait terminé et retourné true
        onOpenChange(false);
      }
    } catch (error) {
      console.error("[ERREUR] Erreur lors de la suppression:", error);
    } finally {
      console.log("[DEBUG] DeleteDialog - Réinitialisation de l'état de traitement");
      // Attendre un peu avant de réinitialiser l'état pour éviter des rendus simultanés
      setTimeout(() => {
        setIsProcessing(false);
      }, 100);
    }
  };

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={(newOpen) => {
        console.log("[DEBUG] DeleteDialog - Changement d'état ouvert:", newOpen, "isProcessing:", isProcessing);
        
        // Ne pas permettre la fermeture pendant le traitement
        if (isProcessing && newOpen === false) {
          return;
        }
        
        // Sinon, propager le changement d'état
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
