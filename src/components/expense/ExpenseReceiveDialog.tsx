
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BluetoothService } from "@/services/bluetooth"; // Updated import
import { Budget } from "@/types/categories";
import { Expense } from "@/services/database/models/expense";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/services/database";
import { AlertCircle, Download } from "lucide-react";
import { useDashboardTitle } from "@/hooks/useDashboardTitle";
import { v4 as uuidv4 } from 'uuid';
import { format } from "date-fns";

interface ExpenseReceiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgets: Budget[];
}

export function ExpenseReceiveDialog({ open, onOpenChange, budgets }: ExpenseReceiveDialogProps) {
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { dashboardTitle, dashboards } = useDashboardTitle();

  // État pour stocker le dashboard sélectionné
  const [selectedDashboardId, setSelectedDashboardId] = useState<string>("");
  
  // Budgets filtrés en fonction du dashboard sélectionné
  const filteredBudgets = selectedDashboardId ? budgets.filter(budget => budget.dashboardId === selectedDashboardId) : [];
  
  const handleFileSelect = async () => {
    if (!selectedBudgetId || !selectedDashboardId) {
      setError("Veuillez sélectionner un tableau de bord et un budget");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Récupérer les dépenses du fichier
      const importedExpenses = await BluetoothService.receiveExpensesFromFile();
      
      if (!importedExpenses || importedExpenses.length === 0) {
        throw new Error("Aucune dépense trouvée dans le fichier");
      }
      
      console.log(`${importedExpenses.length} dépenses importées:`, importedExpenses);
      
      // Transformer les dépenses importées pour les associer au budget sélectionné
      const processedExpenses: Expense[] = importedExpenses.map(expense => ({
        id: uuidv4(), // Générer un nouvel ID pour éviter les conflits
        title: expense.title || "Dépense importée",
        budget: Number(expense.budget) || 0,
        spent: Number(expense.spent) || Number(expense.budget) || 0,
        type: "expense",
        linkedBudgetId: selectedBudgetId,
        date: expense.date || format(new Date(), 'yyyy-MM-dd'),
        dashboardId: selectedDashboardId,
        isRecurring: false // Par défaut, les dépenses importées ne sont pas récurrentes
      }));
      
      // Ajouter les dépenses à la base de données
      for (const expense of processedExpenses) {
        await db.addExpense(expense);
      }
      
      // Mettre à jour le montant dépensé dans le budget sélectionné
      const selectedBudget = budgets.find(b => b.id === selectedBudgetId);
      if (selectedBudget) {
        const totalImportedAmount = processedExpenses.reduce((sum, exp) => sum + exp.budget, 0);
        const updatedBudget = {
          ...selectedBudget,
          spent: selectedBudget.spent + totalImportedAmount
        };
        await db.updateBudget(updatedBudget);
      }
      
      toast({
        title: "Importation réussie",
        description: `${processedExpenses.length} dépense(s) importée(s) avec succès dans le budget "${selectedBudget?.title || 'sélectionné'}".`
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de l'importation des dépenses:", error);
      setError(error instanceof Error ? error.message : "Erreur lors de l'importation des dépenses");
      
      toast({
        variant: "destructive",
        title: "Échec de l'importation",
        description: "Une erreur est survenue lors de l'importation des dépenses."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            <span>Recevoir des dépenses</span>
          </DialogTitle>
          <DialogDescription>
            Importez des dépenses partagées dans le tableau de bord et le budget de votre choix
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 p-3 rounded-md flex items-start gap-2 text-sm text-red-800 mb-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium">Erreur</p>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="dashboard-select">Tableau de bord</Label>
            <Select
              value={selectedDashboardId}
              onValueChange={setSelectedDashboardId}
            >
              <SelectTrigger id="dashboard-select">
                <SelectValue placeholder="Sélectionnez un tableau de bord" />
              </SelectTrigger>
              <SelectContent>
                {dashboards.map(dashboard => (
                  <SelectItem key={dashboard.id} value={dashboard.id}>
                    {dashboard.title || "Tableau de bord sans titre"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget-select">Budget</Label>
            <Select
              value={selectedBudgetId}
              onValueChange={setSelectedBudgetId}
              disabled={!selectedDashboardId || filteredBudgets.length === 0}
            >
              <SelectTrigger id="budget-select">
                <SelectValue placeholder={
                  !selectedDashboardId
                    ? "Sélectionnez d'abord un tableau de bord"
                    : filteredBudgets.length === 0
                      ? "Aucun budget disponible"
                      : "Sélectionnez un budget"
                } />
              </SelectTrigger>
              <SelectContent>
                {filteredBudgets.map(budget => (
                  <SelectItem key={budget.id} value={budget.id}>
                    {budget.title} ({(budget.budget - budget.spent).toFixed(2)} € disponible)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleFileSelect}
            disabled={isLoading || !selectedBudgetId || !selectedDashboardId}
            className="gap-2"
          >
            {isLoading ? (
              "Importation en cours..."
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Sélectionner un fichier</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
