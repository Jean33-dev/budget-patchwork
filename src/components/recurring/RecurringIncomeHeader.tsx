
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecurringIncomeHeaderProps {
  onRefresh: () => void;
  onAdd: () => void;
}

export const RecurringIncomeHeader = ({ onRefresh, onAdd }: RecurringIncomeHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Revenus Récurrents</h1>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
        <Button onClick={onAdd}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>
    </div>
  );
};
