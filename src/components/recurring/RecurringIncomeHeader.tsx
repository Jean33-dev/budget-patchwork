
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecurringIncomeHeaderProps {
  onAdd: () => void;
}

export const RecurringIncomeHeader = ({ onAdd }: RecurringIncomeHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between border-b border-t-0 border-r-0 border-l-0 pb-4">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Revenus Récurrents</h1>
      </div>
      <div>
        <Button onClick={onAdd}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>
    </div>
  );
};
