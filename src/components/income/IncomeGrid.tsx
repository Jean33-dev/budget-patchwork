
import { Income } from "@/services/database/models/income";
import { IncomeCard } from "./IncomeCard";
import { useTheme } from "@/context/ThemeContext";

interface IncomeGridProps {
  incomes: Income[];
  onDelete: (id: string) => void;
  onIncomeClick: (income: Income) => void;
  currency?: "EUR" | "USD" | "GBP";
}

export const IncomeGrid = ({ 
  incomes,
  onDelete,
  onIncomeClick,
  currency
}: IncomeGridProps) => {
  const { currency: globalCurrency } = useTheme();
  const usedCurrency = currency || globalCurrency;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {incomes.map((income) => (
        <IncomeCard
          key={income.id}
          income={income}
          onDelete={onDelete}
          onClick={() => onIncomeClick(income)}
          currency={usedCurrency}
        />
      ))}
    </div>
  );
};
