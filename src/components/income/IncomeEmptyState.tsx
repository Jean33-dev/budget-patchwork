
import React from 'react';

interface IncomeEmptyStateProps {
  onAddClick?: () => void;
}

export const IncomeEmptyState = ({ onAddClick }: IncomeEmptyStateProps) => {
  const { t } = require("@/context/ThemeContext").useTheme(); // Hook dans le composant

  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">{t("income.empty")}</p>
    </div>
  );
};
