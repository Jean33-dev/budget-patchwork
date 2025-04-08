
import React from "react";
import { BudgetEnvelope } from "@/types/transition";

interface EnvelopeCardHeaderProps {
  envelope: BudgetEnvelope;
}

export const EnvelopeCardHeader = ({ envelope }: EnvelopeCardHeaderProps) => {
  return (
    <div className="space-y-1 flex-1">
      <h3 className="font-medium">{envelope.title}</h3>
      <div className="text-sm text-muted-foreground space-y-1">
        <div>Solde restant: {envelope.remaining.toFixed(2)}€</div>
        {envelope.transitionOption === "partial" && envelope.partialAmount !== undefined && (
          <div>Montant reporté: {envelope.partialAmount.toFixed(2)}€</div>
        )}
        {envelope.transitionOption === "transfer" && envelope.transferTargetTitle && (
          <div>
            Transfert vers: {envelope.transferTargetTitle}
          </div>
        )}
        {envelope.transitionOption === "multi-transfer" && envelope.multiTransfers && envelope.multiTransfers.length > 0 && (
          <div>
            <div>Transferts multiples:</div>
            <ul className="list-disc pl-5 mt-1">
              {envelope.multiTransfers.map((transfer, index) => (
                <li key={index}>{transfer.amount.toFixed(2)}€ vers {transfer.targetTitle}</li>
              ))}
            </ul>
            {calculateAvailableAmount(envelope) > 0 && (
              <div className="mt-1">Reste disponible: {calculateAvailableAmount(envelope).toFixed(2)}€</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to calculate available amount for multi-transfers
const calculateAvailableAmount = (envelope: BudgetEnvelope): number => {
  if (!envelope.multiTransfers) return envelope.remaining;
  
  const usedAmount = envelope.multiTransfers.reduce((sum, transfer) => sum + transfer.amount, 0);
  return envelope.remaining - usedAmount;
};
