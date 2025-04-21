
export interface Expense {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: 'expense';
  linkedBudgetId: string; // Changed from optional to required
  date: string;
  isRecurring?: boolean;
  dashboardId?: string;
}
