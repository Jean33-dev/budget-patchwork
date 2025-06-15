
import React from 'react';
import { useTheme } from "@/context/ThemeContext";

interface RecurringExpenseEmptyStateProps {
  onAddClick?: () => void;
}

export const RecurringExpenseEmptyState = ({ onAddClick }: RecurringExpenseEmptyStateProps) => {
  const { t } = useTheme();
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">{t("expenses.emptyRecurringDescription")}</p>
    </div>
  );
};
