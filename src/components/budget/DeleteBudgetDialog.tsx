
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

interface DeleteBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  hasLinkedExpenses: boolean;
}

export const DeleteBudgetDialog = ({
  open,
  onOpenChange,
  onConfirm,
  hasLinkedExpenses,
}: DeleteBudgetDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
          <AlertDialogDescription>
            {hasLinkedExpenses 
              ? "Ce budget a des dépenses qui lui sont associées. Veuillez d'abord réaffecter ces dépenses à d'autres budgets avant de le supprimer."
              : "Êtes-vous sûr de vouloir supprimer ce budget ? Cette action est irréversible."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          {!hasLinkedExpenses && (
            <AlertDialogAction onClick={onConfirm}>Supprimer</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
