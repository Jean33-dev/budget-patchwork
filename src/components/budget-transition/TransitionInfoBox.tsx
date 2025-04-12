
import React from "react";
import { CalendarDays, ArrowRight, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const TransitionInfoBox = () => {
  // Obtenir le mois actuel et le mois suivant
  const currentDate = new Date();
  const nextDate = new Date();
  nextDate.setMonth(nextDate.getMonth() + 1);
  
  const currentMonth = currentDate.toLocaleDateString('fr-FR', { month: 'long' });
  const nextMonth = nextDate.toLocaleDateString('fr-FR', { month: 'long' });
  
  return (
    <div className="space-y-4">
      <div className="bg-muted/40 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays className="h-5 w-5" />
          <h2 className="font-medium">Transition vers le mois prochain</h2>
        </div>
        
        <p className="text-sm mb-3">
          Vous configurez la transition budgétaire de <span className="font-semibold">{currentMonth}</span> vers <span className="font-semibold">{nextMonth}</span>.
          Cette opération vous permet de définir comment les soldes restants de vos budgets seront gérés.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-background p-3 rounded-md border">
            <h3 className="font-medium mb-1">Options disponibles :</h3>
            <ul className="space-y-1 list-disc pl-5">
              <li><span className="font-medium">Réinitialiser</span> : Le solde restant est perdu</li>
              <li><span className="font-medium">Reporter tout</span> : Tout le solde est reporté</li>
              <li><span className="font-medium">Report partiel</span> : Définissez un montant à reporter</li>
              <li><span className="font-medium">Transférer</span> : Déplacez le solde vers un autre budget</li>
              <li><span className="font-medium">Transferts multiples</span> : Répartissez le solde entre plusieurs budgets</li>
            </ul>
          </div>
          
          <div className="bg-background p-3 rounded-md border">
            <h3 className="font-medium mb-1">Que va-t-il se passer ?</h3>
            <ul className="space-y-1 list-disc pl-5">
              <li>Toutes les dépenses ponctuelles seront supprimées</li>
              <li>Les dépenses et revenus récurrents seront conservés</li>
              <li>Les soldes budgétaires seront ajustés selon vos choix</li>
              <li>Les compteurs de dépenses seront remis à zéro</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Alert variant="warning" className="border-amber-500/50 bg-amber-500/10">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-sm">
          Cette opération est irréversible. Exportez vos données en PDF avant de confirmer la transition.
        </AlertDescription>
      </Alert>
    </div>
  );
};
