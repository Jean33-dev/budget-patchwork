
export interface Expense {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: 'expense';
  linkedBudgetId?: string | null;
  date: string;
  dashboardId?: string; // Nouvel attribut pour associer une dépense à un tableau de bord
}
