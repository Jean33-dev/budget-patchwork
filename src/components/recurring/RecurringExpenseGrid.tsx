
import { Expense } from "@/services/database/models/expense";
import { RecurringExpenseCard } from "./RecurringExpenseCard";

interface RecurringExpenseGridProps {
  expenses: Expense[];
  getBudgetName: (budgetId?: string) => string;
  onDelete: (id: string) => void;
  onAddToCurrentMonth: (id: string) => void;
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
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {expenses.map((expense) => (
        <RecurringExpenseCard
          key={expense.id}
          expense={expense}
          getBudgetName={getBudgetName}
          onDelete={onDelete}
          onAddToCurrentMonth={onAddToCurrentMonth}
          onEdit={onEdit}
          currentDate={currentDate}
        />
      ))}
    </div>
  );
};
