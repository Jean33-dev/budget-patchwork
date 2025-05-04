
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ExpenseActionMenu } from "./ExpenseActionMenu";
import { formatAmount } from "@/utils/format-amount";

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

  // Détermine si le montant est élevé pour stylisation différente
  const isHighAmount = expense.budget > 100;

  return (
    <TableRow 
      key={expense.id}
      className={`group cursor-pointer transition-all hover:bg-slate-50 ${isExpanded ? 'bg-slate-50' : ''} border-l-4 ${isHighAmount ? 'border-l-amber-400' : 'border-l-transparent'}`}
      onClick={handleRowClick}
    >
      <TableCell className="font-medium py-3 flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${isHighAmount ? 'bg-amber-400' : 'bg-blue-400'} opacity-70`}></div>
        <div className="flex flex-col">
          <span className="text-gray-800 font-medium line-clamp-1">{expense.title}</span>
          {expense.linkedBudgetId && (
            <span className="text-xs text-gray-500">{getBudgetTitle(expense.linkedBudgetId)}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex flex-col items-end">
          <span className={`font-semibold ${isHighAmount ? 'text-amber-600' : 'text-gray-700'}`}>
            {formatAmount(expense.budget)}
          </span>
          {expense.date && (
            <span className="text-xs text-gray-500">{formatDate(expense.date)}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="w-16 opacity-0 group-hover:opacity-100 transition-opacity">
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
