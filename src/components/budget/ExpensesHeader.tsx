
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigateFunction } from "react-router-dom";
import { ExpenseReceiveDialog } from "../expense/share/ExpenseReceiveDialog";

interface ExpensesHeaderProps {
  onNavigate: NavigateFunction;
}

export const ExpensesHeader = ({ onNavigate }: ExpensesHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onNavigate(-1)}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">Dépenses</h1>
      </div>
      <div>
        <ExpenseReceiveDialog 
          onReceiveComplete={() => window.location.reload()}
        />
      </div>
    </div>
  );
};
