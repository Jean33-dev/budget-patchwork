
import { useTheme } from "@/context/ThemeContext";

export const EmptyBudgetState = () => {
  const { t } = useTheme();
  return (
    <div className="text-center py-8 bg-muted/20 rounded-lg">
      <p className="text-muted-foreground">
        {t("budgets.emptyState")}
      </p>
    </div>
  );
};
