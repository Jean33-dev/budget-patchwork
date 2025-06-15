
import React from 'react';
import { useTheme } from "@/context/ThemeContext";

interface RecurringIncomeEmptyStateProps {
  onAddClick?: () => void;
}

export const RecurringIncomeEmptyState = ({ onAddClick }: RecurringIncomeEmptyStateProps) => {
  const { t } = useTheme();
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">{t("income.emptyRecurring")}</p>
    </div>
  );
};
