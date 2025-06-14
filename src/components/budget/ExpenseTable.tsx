
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExpenseTableRow } from "./ExpenseTableRow";
import { Expense } from "@/services/database/models/expense";
import { Card } from "@/components/ui/card";
import { ListMusic } from "lucide-react";

interface ExpenseTableProps {
  expenses: Array<Expense>;
  onEnvelopeClick?: (envelope: any) => void;
  availableBudgets?: Array<{ id: string; title: string }>;
  onDeleteExpense?: (id: string) => void;
  onUpdateExpense?: (expense: Expense) => void;
  showDebugInfo?: boolean;
  currency?: "EUR" | "USD" | "GBP";
}

export const ExpenseTable = ({
  expenses,
  onEnvelopeClick,
  availableBudgets = [],
  onDeleteExpense,
  onUpdateExpense,
  showDebugInfo = false,
  currency,
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

  const handleUpdate = (updatedExpense: Expense) => {
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
    <Card className="overflow-hidden border-none shadow-sm">
      <div className="max-h-[600px] overflow-y-auto">
        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <ListMusic className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">Aucune dépense</p>
            <p className="text-sm text-gray-400">Ajoutez des dépenses pour les visualiser ici</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {expenses.map((expense) => (
              <React.Fragment key={expense.id}>
                <ExpenseTableRow
                  expense={expense}
                  isExpanded={expandedRow === expense.id}
                  toggleRow={toggleRow}
                  onDelete={onDeleteExpense ? () => onDeleteExpense(expense.id) : undefined}
                  availableBudgets={availableBudgets}
                  onUpdate={handleUpdate}
                  currency={currency}
                />
                {showDebugInfo && process.env.NODE_ENV === 'development' && (
                  <div className="px-4 py-1 bg-gray-50 text-xs text-gray-500">
                    {`Dashboard: ${expense.dashboardId || 'none'}`}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

