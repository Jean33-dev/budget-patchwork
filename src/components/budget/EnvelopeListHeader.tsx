
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
interface EnvelopeListHeaderProps {
  type: "income" | "expense" | "budget";
  onAddClick: () => void;
}
export const EnvelopeListHeader = ({
  type,
  onAddClick
}: EnvelopeListHeaderProps) => {
  const { t } = useTheme();

  const getTypeLabel = (type: "income" | "expense" | "budget") => {
    switch (type) {
      case "income": return t("envelopes.income");
      case "expense": return t("envelopes.expense");
      case "budget": return t("envelopes.budget");
      default: return "";
    }
  };
  const getAddButtonLabel = (type: "income" | "expense" | "budget") => {
    switch (type) {
      case "income": return t("envelopes.add.income");
      case "expense": return t("envelopes.add.expense");
      case "budget": return t("envelopes.add.budget");
      default: return "";
    }
  };
  return <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      
      <Button onClick={onAddClick} variant="outline" size="sm" className="w-full sm:w-auto">
        <PlusCircle className="h-4 w-4 mr-2" />
        {t("envelopes.add")} {getAddButtonLabel(type)}
      </Button>
    </div>;
};
