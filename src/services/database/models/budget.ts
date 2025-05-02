
export interface Budget {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: 'budget';
  carriedOver: number; // Defined as a number, not optional
  dashboardId: string;
}
