
import { RecurringExpenseCard } from "./RecurringExpenseCard";
import { Expense } from "@/services/database/models/expense";

interface RecurringExpenseGridProps {
  expenses: Expense[];
  getBudgetName: (id: string) => string;
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
  currentDate: string;
}

export const RecurringExpenseGrid = ({
  expenses,
  getBudgetName,
  onDelete,
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
          onDelete={() => onDelete(expense.id)}
          onEdit={() => onEdit(expense)}
          currentDate={currentDate}
        />
      ))}
    </div>
  );
};
