
import { Loader2, RotateCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BudgetsHeader } from "./BudgetsHeader";
import { useNavigate } from "react-router-dom";

interface BudgetErrorStateProps {
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

export const BudgetErrorState = ({ onRefresh, isRefreshing }: BudgetErrorStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <BudgetsHeader onNavigate={navigate} />
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>
          Erreur lors du chargement des budgets. Veuillez rafraîchir la page.
        </AlertDescription>
      </Alert>
      <Button 
        onClick={onRefresh} 
        className="mt-4"
        variant="outline"
        disabled={isRefreshing}
      >
        {isRefreshing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Rafraîchissement...
          </>
        ) : (
          <>
            <RotateCw className="h-4 w-4 mr-2" />
            Réessayer
          </>
        )}
      </Button>
    </div>
  );
};
