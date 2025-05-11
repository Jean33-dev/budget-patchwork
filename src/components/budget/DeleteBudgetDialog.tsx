
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
  budgetName?: string;
  isRecurring?: boolean;
}

export const DeleteBudgetDialog = ({
  open,
  onOpenChange,
  onConfirm,
  hasLinkedExpenses,
  budgetName = "",
  isRecurring = false,
}: DeleteBudgetDialogProps) => {
  const itemType = isRecurring ? "dépense récurrente" : "budget";
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            {hasLinkedExpenses ? (
              "Ce budget a des dépenses qui lui sont associées. Veuillez d'abord réaffecter ces dépenses à d'autres budgets avant de le supprimer."
            ) : (
              `Cette action ne peut pas être annulée. ${budgetName ? `Le ${itemType} "${budgetName}"` : `Ce ${itemType}`} sera définitivement supprimé.`
            )}
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
