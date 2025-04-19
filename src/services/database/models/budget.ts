
export interface Budget {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: 'budget';
  carriedOver?: number;
}
