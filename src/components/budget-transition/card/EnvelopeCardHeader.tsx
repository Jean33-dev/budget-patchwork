
import React from 'react';
import { BudgetEnvelope } from "@/types/transition";

interface EnvelopeCardHeaderProps {
  envelope: BudgetEnvelope;
}

export const EnvelopeCardHeader: React.FC<EnvelopeCardHeaderProps> = ({ envelope }) => {
  const { title, remaining, transitionOption, transferTargetTitle, multiTransfers } = envelope;
  const usedAmount = multiTransfers?.reduce((sum, transfer) => sum + transfer.amount, 0) || 0;
  const availableAmount = remaining - usedAmount;
  
  return (
    <div className="space-y-1 flex-1">
      <h3 className="font-medium">{title}</h3>
      <div className="text-sm text-muted-foreground space-y-1">
        <div>Solde restant: {remaining.toFixed(2)}€</div>
        {transitionOption === "transfer" && transferTargetTitle && (
          <div>
            Transfert vers: {transferTargetTitle}
          </div>
        )}
        {transitionOption === "multi-transfer" && multiTransfers && multiTransfers.length > 0 && (
          <div>
            <div>Transferts multiples:</div>
            <ul className="list-disc pl-5 mt-1">
              {multiTransfers.map((transfer, index) => (
                <li key={index}>{transfer.amount.toFixed(2)}€ vers {transfer.targetTitle}</li>
              ))}
            </ul>
            {availableAmount > 0 && (
              <div className="mt-1">Reste disponible: {availableAmount.toFixed(2)}€</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
