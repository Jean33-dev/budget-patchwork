
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Expense } from "@/services/database/models/expense";
import { BluetoothService } from "@/services/bluetooth/bluetooth-service";
import { Bluetooth, Share } from "lucide-react";
import { formatAmount } from "@/utils/format-amount";

interface ExpenseShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenses: Expense[];
  budgetNames: Record<string, string>;
}

export function ExpenseShareDialog({ open, onOpenChange, expenses, budgetNames }: ExpenseShareDialogProps) {
  const [selectedExpenses, setSelectedExpenses] = useState<Record<string, boolean>>({});
  const [isSharing, setIsSharing] = useState(false);
  
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
    try {
      setIsSharing(true);
      
      const expensesToShare = expenses.filter(expense => selectedExpenses[expense.id]);
      
      if (expensesToShare.length === 0) {
        throw new Error("Aucune dépense sélectionnée pour le partage");
      }
      
      const success = await BluetoothService.shareExpensesViaBluetooth(expensesToShare);
      
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Erreur lors du partage des dépenses:", error);
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
