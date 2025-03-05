
import React from "react";

export const TransitionInfoBox = () => {
  return (
    <div className="bg-muted/40 p-4 rounded-lg">
      <h2 className="font-medium mb-2">Comment gérer vos budgets pour le mois prochain</h2>
      <p className="text-sm text-muted-foreground">
        Pour chaque budget, choisissez comment il doit être traité pour le mois prochain :
      </p>
      <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
        <li><strong>Réinitialiser</strong> : Remet le budget à son montant initial, sans report</li>
        <li><strong>Reporter intégralement</strong> : Conserve le montant restant comme report pour le mois suivant</li>
        <li><strong>Reporter partiellement</strong> : Définissez un montant spécifique à reporter</li>
        <li><strong>Transférer</strong> : Déplace le montant restant vers un autre budget</li>
      </ul>
    </div>
  );
};
