
import React, { useState } from "react";
import { formatAmount } from "@/utils/format-amount";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditExpenseDialog } from "./EditExpenseDialog";
import { ExpenseShareDialog } from "@/components/expense/share/ExpenseShareDialog";
import { Expense } from "@/services/database/models/expense";

interface ExpenseTableRowProps {
  expense: Expense;
  isExpanded: boolean;
  toggleRow: (id: string) => void;
  onDelete?: () => void;
  availableBudgets?: Array<{ id: string; title: string }>;
  onUpdate?: (expense: Expense) => void;
  currency?: "EUR" | "USD" | "GBP";
}

export const ExpenseTableRow = ({
  expense,
  isExpanded,
  toggleRow,
  onDelete,
  availableBudgets,
  onUpdate,
  currency
}: ExpenseTableRowProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const formattedDate = expense.date 
    ? new Date(expense.date).toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short' 
      })
    : '';

  return (
    <>
      <div 
        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => toggleRow(expense.id)}
      >
        <div className="flex flex-col">
          <div className="font-medium text-gray-800">{expense.title}</div>
          {formattedDate && (
            <div className="text-xs text-gray-500 mt-0.5">{formattedDate}</div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right font-semibold text-gray-700">
            {formatAmount(expense.budget, currency)}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>
                Supprimer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsShareDialogOpen(true)}>
                Partager
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Boîte de dialogue de modification */}
      <EditExpenseDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title={expense.title}
        onTitleChange={(title) => {
          if (onUpdate && expense) {
            onUpdate({ ...expense, title });
          }
        }}
        budget={expense.budget}
        onBudgetChange={(budget) => {
          if (onUpdate && expense) {
            onUpdate({ ...expense, budget });
          }
        }}
        date={expense.date || new Date().toISOString().split('T')[0]}
        onDateChange={(date) => {
          if (onUpdate && expense) {
            onUpdate({ ...expense, date });
          }
        }}
        onSubmit={() => {
          setIsEditDialogOpen(false);
          if (onUpdate) {
            onUpdate(expense);
          }
        }}
      />

      {/* Boîte de dialogue de partage */}
      {isShareDialogOpen && (
        <ExpenseShareDialog
          expense={expense}
          onShareComplete={() => setIsShareDialogOpen(false)}
        />
      )}
    </>
  );
};
