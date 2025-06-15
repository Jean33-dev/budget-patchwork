
import React from 'react';
import { useTheme } from "@/context/ThemeContext";

interface IncomeEmptyStateProps {
  onAddClick?: () => void;
}

export const IncomeEmptyState = ({ onAddClick }: IncomeEmptyStateProps) => {
  const { t } = useTheme();

  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">{t("income.empty")}</p>
    </div>
  );
};
