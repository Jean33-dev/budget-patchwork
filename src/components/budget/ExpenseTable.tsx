
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
      console.log("ExpenseTable - handleUpdate with expense:", updatedExpense);
      onUpdateExpense(updatedExpense);
    }
    setExpandedRow(null);
  };

  if (process.env.NODE_ENV === 'development') {
    console.log("ExpenseTable - Expenses with dashboardIds:", 
      expenses.map(e => ({ id: e.id, title: e.title, dashboardId: e.dashboardId }))
    );
  }

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden bg-white">
      <div className="max-h-[600px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-gradient-to-r from-slate-50 to-white">
              <TableHead className="text-slate-700 font-semibold">Libellé</TableHead>
              <TableHead className="text-right text-slate-700 font-semibold w-32">Montant</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <path d="M3 3h18v18H3z"></path>
                      <path d="M12 8v8"></path>
                      <path d="M8 12h8"></path>
                    </svg>
                    <span>Aucune dépense</span>
                    <span className="text-xs text-gray-400">Ajoutez des dépenses pour les visualiser ici</span>
                  </div>
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
    </div>
  );
};
