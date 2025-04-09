
import { Income } from "@/services/database/models/income";
import { RecurringIncomeCard } from "./RecurringIncomeCard";

interface RecurringIncomeGridProps {
  incomes: Income[];
  onDelete: (id: string) => void;
}

export const RecurringIncomeGrid = ({ 
  incomes,
  onDelete
}: RecurringIncomeGridProps) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {incomes.map((income) => (
        <RecurringIncomeCard
          key={income.id}
          income={income}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
