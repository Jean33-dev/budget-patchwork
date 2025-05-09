
import { RecurringExpenseCard } from "./RecurringExpenseCard";
import { Expense } from "@/services/database/models/expense";
import { Budget } from "@/types/categories";

interface RecurringExpenseGridProps {
  expenses: Expense[];
  budgets: Budget[];
  getBudgetName: (id: string) => string;
  onDelete: (expense: Expense) => void;
  onAddToCurrentMonth: (id: string) => Promise<boolean>;
  onEdit: (expense: Expense) => void;
  currentDate: string;
}

export const RecurringExpenseGrid = ({
  expenses,
  budgets,
  getBudgetName,
  onDelete,
  onAddToCurrentMonth,
  onEdit,
  currentDate
}: RecurringExpenseGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {expenses.map((expense) => (
        <RecurringExpenseCard
          key={expense.id}
          expense={expense}
          budgetName={getBudgetName(expense.linkedBudgetId)}
          onDelete={() => onDelete(expense)}
          onAddToMonth={() => onAddToCurrentMonth(expense.id)}
          onEdit={() => onEdit(expense)}
          currentDate={currentDate}
        />
      ))}
    </div>
  );
};
