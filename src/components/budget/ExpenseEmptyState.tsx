
import { useTheme } from "@/context/ThemeContext";
import { FileText } from "lucide-react";

export const ExpenseEmptyState = () => {
  const { t } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center py-8 bg-muted/20 rounded-lg">
      <FileText size={46} className="mb-2 text-muted-foreground" />
      <div className="text-lg font-medium text-muted-foreground">{t("expenses.emptyTitle")}</div>
      <div className="text-sm text-muted-foreground mt-2">{t("expenses.emptyDescription")}</div>
    </div>
  );
};
