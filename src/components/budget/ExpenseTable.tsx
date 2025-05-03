
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExpenseTableRow } from "./ExpenseTableRow";

interface ExpenseTableProps {
  expenses: Array<{
    id: string;
    title: string;
    budget: number;
    spent: number;
    type: string;
    linkedBudgetId?: string;
    date?: string;
    dashboardId?: string;
  }>;
  onEnvelopeClick?: (envelope: any) => void;
  availableBudgets?: Array<{ id: string; title: string }>;
  onDeleteExpense?: (id: string) => void;
  onUpdateExpense?: (expense: any) => void;
  showDebugInfo?: boolean;
}

export const ExpenseTable = ({
  expenses,
  onEnvelopeClick,
  availableBudgets = [],
  onDeleteExpense,
  onUpdateExpense,
  showDebugInfo = false
}: ExpenseTableProps) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
    
    // Si on clique sur une ligne et qu'un gestionnaire d'événements de clic est fourni
    if (onEnvelopeClick) {
      const clickedExpense = expenses.find(expense => expense.id === id);
      if (clickedExpense) {
        onEnvelopeClick(clickedExpense);
      }
    }
  };

  const handleUpdate = (updatedExpense: any) => {
    if (onUpdateExpense) {
      // Assurez-vous que dashboardId est conservé lors de la mise à jour
      console.log("ExpenseTable - handleUpdate with expense:", updatedExpense);
      onUpdateExpense(updatedExpense);
    }
    setExpandedRow(null);
  };

  // Débogage - Afficher les IDs des tableaux de bord de chaque dépense
  if (process.env.NODE_ENV === 'development') {
    console.log("ExpenseTable - Expenses with dashboardIds:", 
      expenses.map(e => ({ id: e.id, title: e.title, dashboardId: e.dashboardId }))
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Libellé</TableHead>
            <TableHead className="text-right w-24">Montant</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                Aucune dépense
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <React.Fragment key={expense.id}>
                <ExpenseTableRow
                  expense={expense}
                  isExpanded={expandedRow === expense.id}
                  toggleRow={toggleRow}
                  onDelete={onDeleteExpense ? () => onDeleteExpense(expense.id) : undefined}
                  availableBudgets={availableBudgets}
                  onUpdate={handleUpdate}
                />
                {showDebugInfo && process.env.NODE_ENV === 'development' && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-xs text-gray-500">
                      {`Dashboard: ${expense.dashboardId || 'none'}`}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
