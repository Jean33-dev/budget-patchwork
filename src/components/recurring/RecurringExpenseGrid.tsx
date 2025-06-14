
import { RecurringExpenseCard } from "./RecurringExpenseCard";
import { Expense } from "@/services/database/models/expense";

interface RecurringExpenseGridProps {
  expenses: Expense[];
  getBudgetName: (id: string) => string;
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
  currentDate: string;
  currency?: "EUR" | "USD" | "GBP"; // <--- Ajout de la prop currency
}

export const RecurringExpenseGrid = ({
  expenses,
  getBudgetName,
  onDelete,
  onEdit,
  currentDate,
  currency
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
          currency={currency} // <--- Passe la devise à la carte
        />
      ))}
    </div>
  );
};
