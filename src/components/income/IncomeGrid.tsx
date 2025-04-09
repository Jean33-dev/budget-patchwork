
import { Income } from "@/services/database/models/income";
import { IncomeCard } from "./IncomeCard";

interface IncomeGridProps {
  incomes: Income[];
  onDelete: (id: string) => void;
  onIncomeClick: (income: Income) => void;
}

export const IncomeGrid = ({ 
  incomes,
  onDelete,
  onIncomeClick
}: IncomeGridProps) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {incomes.map((income) => (
        <IncomeCard
          key={income.id}
          income={income}
          onDelete={onDelete}
          onClick={() => onIncomeClick(income)}
        />
      ))}
    </div>
  );
};
