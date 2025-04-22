
import React from 'react';

interface RecurringExpenseEmptyStateProps {
  onAddClick?: () => void;
}

export const RecurringExpenseEmptyState = ({ onAddClick }: RecurringExpenseEmptyStateProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">Aucune dépense récurrente trouvée</p>
    </div>
  );
};
