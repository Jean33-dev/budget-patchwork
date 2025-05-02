
export interface Budget {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: 'budget';
  carriedOver?: number; // S'assurer que c'est bien un number
  dashboardId: string;
}
