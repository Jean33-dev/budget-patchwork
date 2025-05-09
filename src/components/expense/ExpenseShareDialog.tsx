
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Expense } from "@/services/database/models/expense";
import { BluetoothService } from "@/services/bluetooth/bluetooth-service";
import { Bluetooth, Share, AlertCircle } from "lucide-react";
import { formatAmount } from "@/utils/format-amount";
import { useToast } from "@/components/ui/use-toast";

interface ExpenseShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenses: Expense[];
  budgetNames: Record<string, string>;
}

export function ExpenseShareDialog({ open, onOpenChange, expenses, budgetNames }: ExpenseShareDialogProps) {
  const [selectedExpenses, setSelectedExpenses] = useState<Record<string, boolean>>({});
  const [isSharing, setIsSharing] = useState(false);
  const [sharingError, setSharingError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Réinitialiser l'état lors de l'ouverture/fermeture du dialogue
  React.useEffect(() => {
    if (open) {
      // Pré-sélectionner toutes les dépenses par défaut
      const initialSelection: Record<string, boolean> = {};
      expenses.forEach(expense => {
        initialSelection[expense.id] = true;
      });
      setSelectedExpenses(initialSelection);
      setSharingError(null);
    } else {
      setIsSharing(false);
      setSharingError(null);
    }
  }, [open, expenses]);
  
  // Sélectionner/désélectionner toutes les dépenses
  const handleSelectAll = () => {
    const allSelected = expenses.every(expense => selectedExpenses[expense.id]);
    
    if (allSelected) {
      // Désélectionner tout
      setSelectedExpenses({});
    } else {
      // Sélectionner tout
      const newSelected: Record<string, boolean> = {};
      expenses.forEach(expense => {
        newSelected[expense.id] = true;
      });
      setSelectedExpenses(newSelected);
    }
  };
  
  // Gérer le changement de sélection pour une dépense spécifique
  const handleToggleExpense = (expenseId: string) => {
    setSelectedExpenses(prev => ({
      ...prev,
      [expenseId]: !prev[expenseId]
    }));
  };
  
  // Partager les dépenses sélectionnées via Bluetooth
  const handleShareViaBluetooth = async () => {
    setSharingError(null);
    try {
      setIsSharing(true);
      
      const expensesToShare = expenses.filter(expense => selectedExpenses[expense.id]);
      
      if (expensesToShare.length === 0) {
        throw new Error("Aucune dépense sélectionnée pour le partage");
      }
      
      console.log("Tentative de partage de", expensesToShare.length, "dépenses via Bluetooth");
      
      const success = await BluetoothService.shareExpensesViaBluetooth(expensesToShare);
      
      if (success) {
        toast({
          title: "Partage réussi",
          description: `${expensesToShare.length} dépense(s) partagée(s) avec succès`
        });
        onOpenChange(false);
      } else {
        throw new Error("Le partage a échoué pour une raison inconnue");
      }
    } catch (error) {
      console.error("Erreur lors du partage des dépenses:", error);
      setSharingError((error instanceof Error) ? error.message : "Erreur inconnue lors du partage");
      
      toast({
        variant: "destructive",
        title: "Échec du partage",
        description: "Le partage des dépenses via Bluetooth a échoué. Veuillez réessayer."
      });
    } finally {
      setIsSharing(false);
    }
  };
  
  const selectedCount = Object.values(selectedExpenses).filter(Boolean).length;
  const allSelected = expenses.length > 0 && selectedCount === expenses.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bluetooth className="h-5 w-5" />
            <span>Partager les dépenses via Bluetooth</span>
          </DialogTitle>
          <DialogDescription>
            Sélectionnez les dépenses à partager avec un autre appareil
          </DialogDescription>
        </DialogHeader>
        
        {sharingError && (
          <div className="bg-red-50 p-3 rounded-md flex items-start gap-2 text-sm text-red-800 mb-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium">Erreur de partage</p>
              <p>{sharingError}</p>
            </div>
          </div>
        )}
        
        <div className="py-2">
          <div className="flex items-center space-x-2 py-2 border-b mb-2">
            <Checkbox 
              id="select-all" 
              checked={allSelected} 
              onCheckedChange={handleSelectAll}
            />
            <Label htmlFor="select-all" className="font-medium">
              {allSelected ? "Tout désélectionner" : "Tout sélectionner"} ({selectedCount}/{expenses.length})
            </Label>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {expenses.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                Aucune dépense disponible pour le partage
              </p>
            ) : (
              expenses.map((expense) => (
                <div key={expense.id} className="flex items-center space-x-2 py-2 border-b">
                  <Checkbox 
                    id={expense.id}
                    checked={!!selectedExpenses[expense.id]}
                    onCheckedChange={() => handleToggleExpense(expense.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={expense.id} className="font-medium">
                      {expense.title}
                    </Label>
                    <div className="text-sm text-muted-foreground">
                      <span>{formatAmount(expense.budget)} € • </span>
                      <span>{budgetNames[expense.linkedBudgetId] || "Budget inconnu"} • </span>
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            disabled={isSharing}
          >
            Annuler
          </Button>
          <Button
            onClick={handleShareViaBluetooth}
            disabled={isSharing || selectedCount === 0}
            className="gap-2"
          >
            {isSharing ? (
              "Partage en cours..."
            ) : (
              <>
                <Bluetooth className="h-4 w-4" />
                <span>Partager ({selectedCount})</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
