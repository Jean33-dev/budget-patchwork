
export interface Expense {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: 'expense';
  linkedBudgetId?: string;
  date: string;
  isRecurring?: boolean;
  dashboardId?: string; // Ajout de la propriété dashboardId
}
