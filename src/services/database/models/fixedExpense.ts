
export interface FixedExpense {
  id: string;
  title: string;
  budget: number;
  type: 'expense';
  linkedBudgetId?: string | null;
  date: string;
}
