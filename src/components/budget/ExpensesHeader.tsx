
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigateFunction } from "react-router-dom";
import { ExpenseReceiveDialog } from "../expense/share/ExpenseReceiveDialog";
import { useTheme } from "@/context/ThemeContext";

interface ExpensesHeaderProps {
  onNavigate: NavigateFunction;
  showReceiveButton?: boolean;
}

export const ExpensesHeader = ({
  onNavigate,
  showReceiveButton = true
}: ExpensesHeaderProps) => {
  const { t } = useTheme();
  return (
    <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur-md z-10 py-4 mb-6 border-b">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow-sm hover:shadow-md hover:bg-primary/10 transition-all"
        onClick={() => onNavigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div className="flex-1 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            {t("expenses.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("expenses.subtitle")}
          </p>
        </div>

        <div>
          {showReceiveButton && (
            <ExpenseReceiveDialog
              // Remplacement du texte du bouton par la bonne clé
              triggerLabel={t("bluetooth.receive")}
              onReceiveComplete={() => window.location.reload()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

