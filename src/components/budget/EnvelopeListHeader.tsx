import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
interface EnvelopeListHeaderProps {
  type: "income" | "expense" | "budget";
  onAddClick: () => void;
}
export const EnvelopeListHeader = ({
  type,
  onAddClick
}: EnvelopeListHeaderProps) => {
  const getTypeLabel = (type: "income" | "expense" | "budget") => {
    switch (type) {
      case "income":
        return "Revenus";
      case "expense":
        return "Dépenses";
      case "budget":
        return "Budgets";
      default:
        return "";
    }
  };
  const getAddButtonLabel = (type: "income" | "expense" | "budget") => {
    switch (type) {
      case "income":
        return "un revenu";
      case "expense":
        return "une dépense";
      case "budget":
        return "un budget";
      default:
        return "";
    }
  };
  return <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      
      <Button onClick={onAddClick} variant="outline" size="sm" className="w-full sm:w-auto">
        <PlusCircle className="h-4 w-4 mr-2" />
        Ajouter {getAddButtonLabel(type)}
      </Button>
    </div>;
};