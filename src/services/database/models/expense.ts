
export interface Expense {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: 'expense';
  linkedBudgetId: string; // Required - correctly defined
  date: string;
  isRecurring?: boolean;
  dashboardId?: string;
}
