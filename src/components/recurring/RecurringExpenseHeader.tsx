
import { AddButton } from "@/components/budget/AddButton";

interface RecurringExpenseHeaderProps {
  onAdd: () => void;
}

export const RecurringExpenseHeader = ({ onAdd }: RecurringExpenseHeaderProps) => {
  return (
    <div className="mb-6">
      <AddButton 
        onClick={onAdd}
        label="Ajouter une dépense"
      />
    </div>
  );
};
