
import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
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
}

export const ExpenseTableRow = ({
  expense,
  isExpanded,
  toggleRow,
  onDelete,
  availableBudgets,
  onUpdate
}: ExpenseTableRowProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  return (
    <>
      <TableRow key={expense.id} onClick={() => toggleRow(expense.id)} className="cursor-pointer">
        <TableCell className="font-medium">{expense.title}</TableCell>
        <TableCell className="text-right">{formatAmount(expense.budget)}</TableCell>
        <TableCell className="w-16">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" className="h-8 w-8 p-0">
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
        </TableCell>
      </TableRow>

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
