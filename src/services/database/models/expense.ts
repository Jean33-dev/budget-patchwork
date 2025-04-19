
export interface Expense {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "expense";
  linkedBudgetId: string | null;
  date: string;
  isRecurring?: boolean;
  dashboardId?: string; // Ajout de l'ID du tableau de bord
}
