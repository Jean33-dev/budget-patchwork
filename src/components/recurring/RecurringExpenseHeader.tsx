
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface RecurringExpenseHeaderProps {
  onAdd: () => void;
}

export const RecurringExpenseHeader = ({ onAdd }: RecurringExpenseHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex items-center ${isMobile ? 'flex-col gap-3' : 'justify-between'}`}>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Dépenses Récurrentes</h1>
      </div>
      <div>
        <Button onClick={onAdd} className={isMobile ? 'w-full' : ''}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>
    </div>
  );
};
