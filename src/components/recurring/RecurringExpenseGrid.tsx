
import { RecurringExpenseCard } from "./RecurringExpenseCard";
import { Expense } from "@/services/database/models/expense";

interface RecurringExpenseGridProps {
  expenses: Expense[];
  getBudgetName: (id: string) => string;
  onDelete: (id: string) => void;
  onAddToCurrentMonth: (id: string) => Promise<boolean>;
  onEdit: (expense: Expense) => void;
  currentDate: string;
}

export const RecurringExpenseGrid = ({
  expenses,
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
          onDelete={() => onDelete(expense.id)}
          onAddToMonth={async () => {
            try {
              const success = await onAddToCurrentMonth(expense.id);
              return success;
            } catch (error) {
              console.error("Error adding expense to current month:", error);
              return false;
            }
          }}
          onEdit={() => onEdit(expense)}
          currentDate={currentDate}
        />
      ))}
    </div>
  );
};
