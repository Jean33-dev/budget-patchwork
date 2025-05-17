import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
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

  return (
    <>
      <TableRow key={expense.id} onClick={() => toggleRow(expense.id)} className="cursor-pointer">
        <TableCell className="font-medium">{expense.title}</TableCell>
        <TableCell className="text-right">{formatCurrency(expense.budget)}</TableCell>
        <TableCell className="w-16">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>
                Supprimer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ExpenseShareDialog expense={expense} onShareComplete={() => {}} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <EditExpenseDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        expense={expense}
        availableBudgets={availableBudgets}
        onUpdate={onUpdate}
      />
    </>
  );
};
