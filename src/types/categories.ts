
export interface Budget {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "budget";
  categoryId?: string;
  carriedOver?: number;
  dashboardId?: string;
}
