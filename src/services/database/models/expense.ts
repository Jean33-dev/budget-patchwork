
export interface Expense {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: 'expense';
  linkedBudgetId?: string;
  date: string;
  visible?: boolean; // Nouveau champ pour indiquer si la dépense est visible
}
