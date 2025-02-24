
export interface BudgetPeriod {
  id: string;
  startDate: string; // Date de début de la période
  endDate: string | null; // Date de fin de la période (null si période en cours)
  name: string; // ex: "Février 2024"
}
