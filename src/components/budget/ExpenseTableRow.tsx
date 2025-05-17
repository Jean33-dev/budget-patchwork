
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { formatAmount } from "@/utils/format-amount";
import { Button } from "@/components/ui/button";
import { Budget, Expense } from "@/hooks/useExpenseManagement";
import { useState, useMemo } from "react";
import { ExpenseShareDialog } from "../expense/share/ExpenseShareDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ExpenseTableRowProps {
  expense: Expense;
  isExpanded: boolean;
  toggleRow: (id: string) => void;
  onDelete?: (id: string) => void;
  availableBudgets?: Array<{ id: string; title: string; }>;
  onUpdate?: (updatedExpense: Expense) => void;
}

export const ExpenseTableRow = ({
  expense,
  isExpanded,
  toggleRow,
  onDelete,
  availableBudgets,
  onUpdate
}: ExpenseTableRowProps) => {
  const [editedTitle, setEditedTitle] = useState(expense.title);
  const [editedBudget, setEditedBudget] = useState(expense.budget.toString());
  const [editedBudgetId, setEditedBudgetId] = useState(expense.linkedBudgetId || "");
  const [editedDate, setEditedDate] = useState(expense.date || "");
  
  // Find the selected budget's name
  const selectedBudgetName = useMemo(() => {
    if (!availableBudgets) return "Inconnu";
    const budget = availableBudgets.find(budget => budget.id === expense.linkedBudgetId);
    return budget ? budget.title : "Inconnu";
  }, [availableBudgets, expense.linkedBudgetId]);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...expense,
        title: editedTitle,
        budget: parseFloat(editedBudget),
        spent: parseFloat(editedBudget), // Définir spent égal à budget
        linkedBudgetId: editedBudgetId,
        date: editedDate
      });
    }
  };

  const handleEscape = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      toggleRow(expense.id);
    }
  };

  const onBudgetChange = (value: string) => {
    setEditedBudget(value.replace(/[^0-9.]/g, ''));
  };

  return (
    <>
      <TableRow
        className="cursor-pointer hover:bg-accent/30"
        onClick={() => toggleRow(expense.id)}
      >
        <TableCell>
          <div>
            <span className="font-medium">{expense.title}</span>
            {expense.date && (
              <div className="text-xs text-muted-foreground mt-1">
                {expense.date}
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <span className="font-medium">{formatAmount(expense.budget)}</span>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end space-x-1">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow className="bg-muted/40">
          <TableCell colSpan={3} className="p-4">
            <div className="space-y-4">
              {/* Budget associé et date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="budgetSelect" className="text-sm">Budget</Label>
                  {availableBudgets && onUpdate ? (
                    <Select 
                      value={editedBudgetId} 
                      onValueChange={setEditedBudgetId}
                    >
                      <SelectTrigger id="budgetSelect" className="h-8">
                        <SelectValue placeholder="Sélectionner un budget" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBudgets.map(budget => (
                          <SelectItem key={budget.id} value={budget.id}>
                            {budget.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-sm text-muted-foreground p-1">
                      {selectedBudgetName}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="dateInput" className="text-sm">Date</Label>
                  {onUpdate ? (
                    <Input
                      id="dateInput"
                      type="date"
                      value={editedDate}
                      onChange={(e) => setEditedDate(e.target.value)}
                      className="h-8"
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground p-1">
                      {expense.date}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Titre et montant */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="titleInput" className="text-sm">Titre</Label>
                  {onUpdate ? (
                    <Input
                      id="titleInput"
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="h-8"
                      onKeyDown={handleEscape}
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground p-1">
                      {expense.title}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="budgetInput" className="text-sm">Montant</Label>
                  {onUpdate ? (
                    <Input
                      id="budgetInput"
                      type="text"
                      value={editedBudget}
                      onChange={(e) => onBudgetChange(e.target.value)}
                      className="h-8"
                      onKeyDown={handleEscape}
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground p-1">
                      {formatAmount(expense.budget)}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-2">
                <div className="flex space-x-2">
                  {onUpdate && (
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => {
                        handleSave();
                        toggleRow(expense.id);
                      }}
                    >
                      Enregistrer
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(expense.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1 text-destructive" />
                      <span>Supprimer</span>
                    </Button>
                  )}
                </div>
                <ExpenseShareDialog
                  expense={expense}
                  onShareComplete={() => toggleRow(expense.id)}
                />
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
