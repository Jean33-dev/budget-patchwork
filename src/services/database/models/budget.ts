
export interface Budget {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: 'budget';
  carriedOver?: number; // Assurer que c'est bien un number
  dashboardId: string;
}
