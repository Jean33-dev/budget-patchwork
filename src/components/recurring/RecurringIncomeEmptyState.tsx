
import React from 'react';

interface RecurringIncomeEmptyStateProps {
  onAddClick?: () => void;
}

export const RecurringIncomeEmptyState = ({ onAddClick }: RecurringIncomeEmptyStateProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">Aucun revenu récurrent trouvé</p>
    </div>
  );
};
