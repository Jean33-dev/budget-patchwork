
import React from 'react';

interface IncomeEmptyStateProps {
  onAddClick?: () => void;
}

export const IncomeEmptyState = ({ onAddClick }: IncomeEmptyStateProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">Aucun revenu trouvé</p>
    </div>
  );
};
