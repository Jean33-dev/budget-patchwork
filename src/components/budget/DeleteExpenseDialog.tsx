
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
}

export const DeleteExpenseDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: DeleteExpenseDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const confirmedRef = useRef(false);
  const safeToCloseRef = useRef(true);
  
  // Réinitialiser l'état quand la boîte de dialogue change d'état
  useEffect(() => {
    if (!open) {
      console.log("Dialog fermé, réinitialisation de l'état de traitement");
      setIsProcessing(false);
      confirmedRef.current = false;
      // Réinitialiser l'état de sécurité après la fermeture
      setTimeout(() => {
        safeToCloseRef.current = true;
      }, 100);
    }
  }, [open]);

  const handleConfirm = async (e: React.MouseEvent) => {
    console.log("Confirmation cliquée");
    e.preventDefault();
    
    // Vérifier si le traitement est déjà en cours
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
        
        // Différer la fermeture de la boîte de dialogue
        setTimeout(() => {
          if (open) { // Vérifier que la boîte est encore ouverte
            console.log("Fermeture effective de la boîte de dialogue");
            onOpenChange(false);
          }
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
        console.log("Changement d'état de la boîte de dialogue:", newOpen);
        // Empêcher la fermeture pendant le traitement ou lorsque ce n'est pas sécuritaire
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
