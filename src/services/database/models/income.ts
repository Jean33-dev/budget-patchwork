
export interface Income {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: 'income';
  date: string;
  isRecurring?: boolean;
}
