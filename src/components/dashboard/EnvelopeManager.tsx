
import { useState } from "react";
import { EnvelopeList } from "@/components/budget/EnvelopeList";
import { Button } from "@/components/ui/button";
import { Budget } from "@/services/database/models/budget";
import { Expense } from "@/services/database/models/expense";
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

interface EnvelopeManagerProps {
  envelopes?: Array<{
    id: string;
    title: string;
    budget: number;
    spent: number;
    type: "income" | "expense" | "budget";
  }>;
  budgets?: Budget[];
  expenses?: Expense[];
  showEnvelopes?: boolean;
  toggleEnvelopes?: () => void;
  handleTransitionBudget?: () => void;
  handleExportPDF?: () => void;
  isLoading?: boolean;
  onAddClick?: (type: "income" | "expense" | "budget") => void;
  onEnvelopeClick?: (envelope: any) => void;
}

export const EnvelopeManager = ({ 
  envelopes = [],
  budgets = [], 
  expenses = [], 
  showEnvelopes = true,
  toggleEnvelopes = () => {},
  handleTransitionBudget = () => {},
  handleExportPDF = () => {},
  isLoading = false,
  onAddClick = () => {},
  onEnvelopeClick = () => {}
}: EnvelopeManagerProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Combinaison des budgets et des dépenses pour l'affichage
  const combinedEnvelopes = [
    ...budgets.map(b => ({
      id: b.id,
      title: b.title,
      budget: Number(b.budget),
      spent: Number(b.spent || 0),
      type: b.type,
    })),
    ...expenses.map(e => ({
      id: e.id,
      title: e.title,
      budget: Number(e.budget),
      spent: Number(e.spent || 0),
      type: e.type,
      linkedBudgetId: e.linkedBudgetId,
      date: e.date
    }))
  ];

  // Si les données sont en cours de chargement, afficher un message
  if (isLoading) {
    return <div className="p-8 text-center">Chargement des enveloppes...</div>;
  }

  return (
    <div className="space-y-8">
      {showEnvelopes && (
        <EnvelopeList
          envelopes={combinedEnvelopes}
          type="income"
          onAddClick={() => onAddClick("income")}
          onEnvelopeClick={onEnvelopeClick}
        />
      )}
      
      {showEnvelopes && (
        <EnvelopeList
          envelopes={combinedEnvelopes}
          type="budget"
          onAddClick={() => onAddClick("budget")}
          onEnvelopeClick={onEnvelopeClick}
        />
      )}
      
      {showEnvelopes && (
        <EnvelopeList
          envelopes={combinedEnvelopes}
          type="expense"
          onAddClick={() => onAddClick("expense")}
          onEnvelopeClick={onEnvelopeClick}
        />
      )}
      
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'exportation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir exporter votre budget en PDF ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleExportPDF}>
              Exporter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
