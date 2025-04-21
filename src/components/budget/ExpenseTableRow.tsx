
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ExpenseActionMenu } from "./ExpenseActionMenu";

interface ExpenseTableRowProps {
  expense: {
    id: string;
    title: string;
    budget: number;
    spent: number;
    type: string;
    linkedBudgetId?: string;
    date?: string;
    dashboardId?: string;
  };
  isExpanded: boolean;
  toggleRow: (id: string) => void;
  onDelete?: (() => void) | undefined;
  availableBudgets: Array<{ id: string; title: string }>;
  onUpdate: (updatedExpense: any) => void;
}

export const ExpenseTableRow = ({
  expense,
  isExpanded,
  toggleRow,
  onDelete,
  availableBudgets,
  onUpdate
}: ExpenseTableRowProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non spécifiée";
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date invalide";
    }
  };

  const getBudgetTitle = (budgetId?: string): string => {
    if (!budgetId) return "Non catégorisé";
    const budget = availableBudgets.find(b => b.id === budgetId);
    return budget ? budget.title : "Catégorie inconnue";
  };

  const handleRowClick = () => {
    toggleRow(expense.id);
  };

  return (
    <TableRow 
      key={expense.id}
      className={`cursor-pointer hover:bg-muted ${isExpanded ? 'bg-muted' : ''}`}
      onClick={handleRowClick}
    >
      <TableCell className="font-medium">
        {expense.title}
      </TableCell>
      <TableCell className="text-right">
        {Number(expense.budget).toFixed(2)} €
      </TableCell>
      <TableCell>
        {onDelete && (
          <ExpenseActionMenu
            onDeleteClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        )}
      </TableCell>
    </TableRow>
  );
};
