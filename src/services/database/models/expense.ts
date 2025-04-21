
export interface Expense {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: 'expense';
  linkedBudgetId: string; // Désormais obligatoire
  date: string;
  isRecurring?: boolean;
  dashboardId?: string;
}
